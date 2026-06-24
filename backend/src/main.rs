mod api;
mod docker;

#[tokio::main]
async fn main() {
    api::init().await;
}