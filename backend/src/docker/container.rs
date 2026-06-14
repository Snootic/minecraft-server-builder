use futures_util::StreamExt;
use serde::Deserialize;
use std::collections::HashMap;
use bollard::{
    Docker, errors::Error, plugin::{ContainerCreateBody, ContainerSummary}, query_parameters::{CreateContainerOptions, CreateImageOptions, ListContainersOptionsBuilder, ListImagesOptionsBuilder}
};

use crate::docker::platform::app_data_dir;

use super::{connection::connect_to_network, platform::docker_platform};

#[derive(Deserialize)]
pub enum ContainerType {
    Server,
    Proxy,
    All,
}

#[derive(Deserialize)]
pub struct ProxyOptions {
    pub autoscale_up: Option<bool>,
    pub autoscale_down: Option<bool>,
    pub autoscale_down_after: Option<String>,
    pub simplify_srv: Option<bool>,
    pub webhook_url: Option<String>,
    pub labels: Option<HashMap<String, String>>
}

#[derive(Deserialize)]
pub struct ServerProxyOptions {
    host: String,
    autoscale_up: Option<bool>,
    autoscale_down: Option<bool>,
    asleep_motd: Option<String>,
    loading_motd: Option<String>,
}

#[derive(Deserialize)]
pub struct ServerOptions {
    name: Option<String>,
}

async fn pull_image_if_not_exists(docker: &Docker, image_name: String, force_pull: Option<bool>) -> Result<(), Error> {
    let search_filters = HashMap::from([("reference", vec![image_name.clone()])]);
    let search_options = ListImagesOptionsBuilder::default()
        .all(true)
        .filters(&search_filters)
        .build();

    let images = docker.list_images(Some(search_options)).await?;

    if !images.is_empty() && force_pull.unwrap_or(false) {
        return Ok(());
    }

    let image_options = Some(CreateImageOptions {
        from_image: Some(image_name),
        tag: Some(String::from("latest")),
        ..Default::default()
    });

    let mut stream = docker.create_image(
        image_options,
        None,
        None,
    );

    while let Some(progress) = stream.next().await {
        progress?;
    }

    Ok(())
}

pub async fn list_containers(docker: &Docker, container_type: ContainerType) -> Result<Vec<ContainerSummary>, Error> {
    let mut filters = HashMap::new();

    let mut image_vec = Vec::new();

    match container_type {
        ContainerType::Server => image_vec.push(String::from("itzg/minecraft-server")),
        ContainerType::Proxy => image_vec.push(String::from("itzg/mc-router")),
        ContainerType::All => {
            image_vec.push(String::from("itzg/minecraft-server"));
            image_vec.push(String::from("itzg/mc-router"));
        },
    };

    filters.insert("ancestor", image_vec);

    let options = ListContainersOptionsBuilder::default()
        .filters(&filters)
        .all(true)
        .build();

    let containers = docker.list_containers(Some(options)).await?;

    Ok(containers)
}

pub async fn create_server_container(
    docker: &Docker,
    server_options: ServerOptions,
    proxy_options: Option<ServerProxyOptions>
) -> Result<(), Error> {
    let container_name = server_options.name.clone().unwrap_or_else(|| String::from("mc-server"));
    let image_name = String::from("itzg/minecraft-server");

    let data_path = app_data_dir().join(&container_name);

    let config = ContainerCreateBody {
        image: Some(image_name.clone()),
        tty: Some(true),
        open_stdin: Some(true),
        env: Some(vec![
            String::from("EULA=TRUE")
        ]),
        volumes: Some(vec![format!("{}:/data", data_path.to_str().unwrap())]),
        ..Default::default()
    };

    let options = CreateContainerOptions {
        name: Some(container_name.clone()),
        platform: docker_platform(),
    };

    pull_image_if_not_exists(docker, image_name, None).await?;

    docker.create_container(Some(options), config).await?;

    connect_to_network(&"mcserver-network", container_name, &docker, true).await?;

    Ok(())
}

pub async fn create_proxy_container(docker: &Docker, options: ProxyOptions) -> Result<(), Error> {
    let image_name = String::from("itzg/mc-router:latest");
    let container_name = String::from("mc-proxy");

    let mut env = Vec::new();

    if let Some(v) = options.autoscale_up {
        env.push(format!("AUTOSCALE_UP={v}"));
    }
    if let Some(v) = options.autoscale_down {
        env.push(format!("AUTOSCALE_DOWN={v}"));
    }
    if let Some(v) = options.autoscale_down_after {
        env.push(format!("AUTOSCALE_DOWN_AFTER={v}"));
    }
    if let Some(v) = options.simplify_srv {
        env.push(format!("SIMPLIFY_SRV={v}"));
    }
    if let Some(v) = options.webhook_url {
        env.push(format!("WEBHOOK_URL={v}"));
    }

    let config = ContainerCreateBody {
        image: Some(image_name.clone()),
        tty: Some(true),
        open_stdin: Some(true),
        env: Some(env),
        labels: Some(options.labels.unwrap_or_default()),
        ..Default::default()
    };

    let options = CreateContainerOptions {
        name: Some(container_name.clone()),
        platform: docker_platform(),
    };

    pull_image_if_not_exists(docker, image_name, None).await?;

    docker.create_container(Some(options.clone()), config.clone()).await?;

    connect_to_network(&"mcserver-network", container_name, &docker, true).await?;

    Ok(())
}
