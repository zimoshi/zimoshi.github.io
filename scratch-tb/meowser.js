(function (Scratch) {
  "use strict";

  const featurePolicy = {
    accelerometer: "'none'",
    camera: "'none'",
    geolocation: "'none'",
    microphone: "'none'",
    "payment": "'none'",
  };

  const SANDBOX = ["allow-same-origin", "allow-scripts", "allow-forms"];

  const activeFrames = {};
  const activeHTMeows = {};

  const createIframe = (id, x, y, size, style, url) => {
    const iframe = document.createElement("iframe");
    iframe.id = id;
    iframe.style.position = "absolute";
    iframe.style.left = `${x}px`;
    iframe.style.top = `${y}px`;
    iframe.style.width = `${size}px`;
    iframe.style.height = `${size}px`;
    iframe.style.border = "none";
    iframe.style.cssText += style;
    iframe.setAttribute("sandbox", SANDBOX.join(" "));
    iframe.setAttribute(
      "allow",
      Object.entries(featurePolicy)
        .map(([name, permission]) => `${name} ${permission}`)
        .join("; ")
    );
    iframe.src = url;

    document.body.appendChild(iframe);
    activeFrames[id] = iframe;

    iframe.onload = () => Scratch.vm.runtime.startHats("event_meowframe_loaded", { ID: id });
    iframe.onerror = () => Scratch.vm.runtime.startHats("event_meowframe_error", { ID: id });
  };

  const createHTMeow = (id, x, y, size, html) => {
    const div = document.createElement("div");
    div.id = id;
    div.style.position = "absolute";
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.width = `${size}px`;
    div.style.height = `${size}px`;
    div.innerHTML = html;

    document.body.appendChild(div);
    activeHTMeows[id] = div;

    Scratch.vm.runtime.startHats("event_htmeow_loaded", { ID: id });
  };

  const resizeElement = (id, type, size) => {
    const element = type === "frame" ? activeFrames[id] : activeHTMeows[id];
    if (element) {
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
    }
  };

  const removeElement = (id, type) => {
    const element = type === "frame" ? activeFrames[id] : activeHTMeows[id];
    if (element) {
      document.body.removeChild(element);
      if (type === "frame") delete activeFrames[id];
      else delete activeHTMeows[id];
    }
  };

  class MeowserExtension {
    getInfo() {
      return {
        id: "meowser",
        name: "Meowser Extension",
        blocks: [
          {
            opcode: "createMeowFrame",
            blockType: Scratch.BlockType.COMMAND,
            text: "create meowframe id: [ID] x: [X] y: [Y] size: [SIZE] style: [STYLE] url: [URL]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "cat1" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              STYLE: { type: Scratch.ArgumentType.STRING, defaultValue: "color: green;" },
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://scratch.mit.edu" },
            },
          },
          {
            opcode: "createHTMeow",
            blockType: Scratch.BlockType.COMMAND,
            text: "embed HTMeow id: [ID] x: [X] y: [Y] size: [SIZE] html: [HTML]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "ht1" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              HTML: { type: Scratch.ArgumentType.STRING, defaultValue: "<h1>Hello Meow!</h1>" },
            },
          },
          {
            opcode: "resizeElement",
            blockType: Scratch.BlockType.COMMAND,
            text: "resize [TYPE] id: [ID] to size: [SIZE]",
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "elementTypeMenu",
              },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "cat1" },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
            },
          },
          {
            opcode: "removeElement",
            blockType: Scratch.BlockType.COMMAND,
            text: "remove [TYPE] id: [ID]",
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "elementTypeMenu",
              },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "cat1" },
            },
          },
        ],
        menus: {
          elementTypeMenu: {
            acceptReporters: true,
            items: ["frame", "htmeow"],
          },
        },
      };
    }

    createMeowFrame(args) {
      createIframe(args.ID, args.X, args.Y, args.SIZE, args.STYLE, args.URL);
    }

    createHTMeow(args) {
      createHTMeow(args.ID, args.X, args.Y, args.SIZE, args.HTML);
    }

    resizeElement(args) {
      resizeElement(args.ID, args.TYPE, args.SIZE);
    }

    removeElement(args) {
      removeElement(args.ID, args.TYPE);
    }
  }

  Scratch.extensions.register(new MeowserExtension());
})(Scratch);
