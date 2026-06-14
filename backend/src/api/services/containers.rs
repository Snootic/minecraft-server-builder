use bollard::{errors::Error, plugin::ContainerSummary};
use crate::docker::{
    connection::connect_to_docker,
    container::{
        ContainerType,
        ProxyOptions,
        ServerOptions,
        ServerProxyOptions,
        create_proxy_container,
        create_server_container,
        list_containers
    }
};

pub(crate) enum CreateContainerRequest {
    Proxy(ProxyOptions),
    Server(ServerOptions, Option<ServerProxyOptions>),
}

pub async fn list_mc_containers(container_type: ContainerType) -> Result<Vec<ContainerSummary>, Error> {
    let docker = connect_to_docker()?;

    list_containers(&docker, container_type).await
}

pub async fn create_container(create_container_req: CreateContainerRequest) -> Result<(), Error> {
    let docker = connect_to_docker()?;

    match create_container_req {
        CreateContainerRequest::Proxy(options) => 
            create_proxy_container(&docker, options).await,
        CreateContainerRequest::Server(server_options, server_proxy_options) => 
            create_server_container(&docker, server_options, server_proxy_options).await
    }
}