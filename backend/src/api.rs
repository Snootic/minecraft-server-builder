use std::env;

use axum::{routing::get, Router};

pub mod controllers;
pub mod routes;
pub mod services;
mod error_handling;

pub async fn init() {
    let app = Router::new()
        .route("/", get(|| async { "Hello, Rust!" }))
        .nest("/containers", routes::containers::router());

    let port = env::var("PORT").unwrap_or_else(|_| "3001".into());
    let addr = format!("0.0.0.0:{}", port);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}