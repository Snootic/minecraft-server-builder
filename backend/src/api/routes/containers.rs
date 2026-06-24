use axum::{Router, routing::{get, post}};

use super::super::controllers::containers;

pub fn router() -> Router {
    Router::new()
        .route("/", get(containers::list_containers))

        .route("/servers", post(containers::create_server_container))

        .route("/proxies", post(containers::create_proxy_container))
}