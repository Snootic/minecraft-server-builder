use axum::{http::StatusCode, response::Json};

use bollard::errors::Error;
use std::error::Error as StdError;

use serde_json::{Value, json};

fn docker_error_to_status(err: &Error) -> (StatusCode, String) {
    match err {
        Error::DockerResponseServerError { status_code, message } => {
            (
                StatusCode::from_u16(*status_code).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
                message.clone()
            )
        }
        _ => (StatusCode::INTERNAL_SERVER_ERROR, String::from("An unexpected error occurred")),
    }
}

pub fn handle_error(error: &(dyn StdError + 'static)) -> (StatusCode, Json<Value>) {
    if let Some(docker_err) = error.downcast_ref::<Error>() {
        let (status, message) = docker_error_to_status(docker_err);
        return (
            status,
            Json(json!({ "error": message })),
        );
    }

    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(json!({ "error": error.to_string() })),
    )
}
