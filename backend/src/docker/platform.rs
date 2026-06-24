use std::env::consts::OS;
use std::env::consts::ARCH;

pub fn docker_platform() -> String {
    let os = OS;
    let arch = match ARCH {
        "x86_64" => "amd64",
        "aarch64" => "arm64",
        other => other,
    };

    format!("{}/{}", os, arch)
}

use std::{env, path::PathBuf};

pub fn app_data_dir() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        if let Ok(appdata) = env::var("APPDATA") {
            return PathBuf::from(appdata).join("mc-server-builder");
        }
    }

    #[cfg(target_os = "macos")]
    {
        if let Ok(home) = env::var("HOME") {
            return PathBuf::from(home)
                .join("Library")
                .join("Application Support")
                .join("mc-server-builder");
        }
    }

    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    {
        if let Ok(xdg) = env::var("XDG_DATA_HOME") {
            return PathBuf::from(xdg).join("mc-server-builder");
        }

        if let Ok(home) = env::var("HOME") {
            return PathBuf::from(home)
                .join(".local")
                .join("share")
                .join("mc-server-builder");
        }
    }

    PathBuf::from("./mc-server-builder")
}
