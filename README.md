# Minecraft Server Builder

<code>Avaible at <a href="https://minecraft.coisas-mais-estranhas.com.br" target="_blank" rel="noopener noreferrer">minecraft.coisas-mais-estranhas.com.br</a></code>

This project lets you build and configure a Minecraft server, supporting gamerules, properties and start file management with a interactive web interface. You can manage modpacks, mods and datapacks available in [Modrinth](https://www.curseforge.com/minecraft/mc-mods).

Currently there is only support for modloaders (Fabric, Forge and Quilt) and datapacks, but support for plugins (paper, velocity, pupur etc.) is planned. The project is still in early development, so expect some bugs and missing features, although the very necessary for a functional server is already available and working (I hope).

## Localization
As I am not a poliglot and speak only English and Portuguese, most of the translation on the project was done by AI (GPT-4.1 and Claude Sonnet 4.5). So if you find any translation that is wrong or just sounds weird, please open an issue or, better, a PR with the fix, I will be more than grateful for that.

## Contributing
If you want to contribute to the project, you can open an issue or a PR with your changes. I will try to review and merge it as soon as possible.

## Running the project
The project run 100% on client side (Vite and React), so you can build it and run it on your own machine without any complications:
```bash
npm install
npm run build
npm run preview
```

#### Development:
```bash
npm install
npm run dev
```

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.