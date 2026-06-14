use axum::{extract::{Query}, http::StatusCode, response::Json as ResJson, extract::Json as ExtractJson};
use serde::Deserialize;
use serde_json::{Value, json};

use crate::{
    api::{error_handling::handle_error, services::containers::{self, CreateContainerRequest}}, 
    docker::container::{ContainerType, ProxyOptions, ServerOptions, ServerProxyOptions}
};

#[derive(Deserialize)]
pub(crate) struct ListContainersParams {
    container_type: Option<ContainerType>,
}

pub async fn list_containers(Query(params): Query<ListContainersParams>) -> Result<ResJson<Value>, (StatusCode, ResJson<Value>)> {
    let container_type = params.container_type.unwrap_or(ContainerType::All);

    let containers = containers::list_mc_containers(container_type).await
        .map_err(|err| handle_error(&err))?;

    Ok(ResJson(json!({
        "containers": containers
    })))
}

pub async fn create_proxy_container(ExtractJson(options): ExtractJson<ProxyOptions>) -> Result<ResJson<Value>, (StatusCode, ResJson<Value>)> {
    containers::create_container(CreateContainerRequest::Proxy(options)).await
        .map_err(|err| handle_error(&err))?;

    Ok(ResJson(json!({
        "status": "MC Router proxy container created successfully"
    })))
}

pub async fn create_server_container(ExtractJson(options): ExtractJson<(ServerOptions, Option<ServerProxyOptions>)>) -> Result<ResJson<Value>, (StatusCode, ResJson<Value>)> {
    containers::create_container(CreateContainerRequest::Server(options.0, options.1)).await
        .map_err(|err| handle_error(&err))?;

    Ok(ResJson(json!({
        "status": "Minecraft server container created successfully"
    })))
}