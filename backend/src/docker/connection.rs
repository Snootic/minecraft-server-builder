use std::collections::HashMap;

use bollard::{
    Docker,
    errors::Error,
    plugin::{NetworkConnectRequest, NetworkCreateRequest}, query_parameters::ListNetworksOptionsBuilder
};

pub fn connect_to_docker() -> Result<Docker, Error> {
    Docker::connect_with_local_defaults()
}

pub async fn connect_to_network(network_name: &str, container_name: String, docker: &Docker, create_if_not_exists: bool) -> Result<(), Error> {
    let search_filters = HashMap::from([("name", vec![network_name])]);
    let search_options = ListNetworksOptionsBuilder::default()
        .filters(&search_filters)
        .build();

    let networks = docker.list_networks(Some(search_options)).await?;

    if networks.is_empty() {
        if !create_if_not_exists {
            return Err(Error::DockerResponseServerError {
                status_code: 404,
                message: "Network does not exist, cannot connect.".to_string(),
            });
        }

        create_shared_network(network_name, docker).await?;
    }

    let connect_request = NetworkConnectRequest {
        container: container_name,
        endpoint_config: None,
    };
    docker.connect_network(network_name, connect_request).await
}

async fn create_shared_network(network_name: &str, docker: &Docker) -> Result<(), Error> {
    let config = NetworkCreateRequest {
        name: network_name.to_string(),
        driver: Some("bridge".to_string()),
        ..Default::default()
    };

    match docker.create_network(config).await {
        Ok(_) => Ok(()),
        Err(Error::DockerResponseServerError { status_code: 409, .. }) => Ok(()),
        Err(err) => Err(err),
    }
}
