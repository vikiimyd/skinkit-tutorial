// All text on the page lives here. Edit this file to change what the page says;
// index.html and script.js do not need to change.
// Facts come from the SkinKit paper (Ku et al., IMWUT 2021). "TODO" marks what the paper
// does not say and still needs to be confirmed with the mentor.
// shot: the clip ID from the shot list. Put the exported clip in images/ and set media.

window.SKINKIT = {
  // ---------- Part 1: What is SkinKit ----------
  headline: "Electronics you wear like a temporary tattoo.",
  intro:
    "SkinKit is a construction kit for building interactive devices that sit right on your skin. " +
    "Small circuit modules click onto soft, tattoo-thin pieces called skin cloth, held by tiny magnets. " +
    "Each module does one job, and the order you connect them decides what your device does. No coding, no soldering.",
  facts: [
    { value: "16", label: "modules to combine" },
    { value: "2 × 2 cm", label: "per module, paper-thin" },
    { value: "< 23 min", label: "average first build in the lab's study" }
  ],
  overviewVideo: { youtube: "", shot: "0-00" }, // the overview video's YouTube link, once uploaded

  how: [
    { title: "Pick your modules", text: "Yellow modules sense, blue ones change the signal, white ones do something you can see or feel. Red gives power." },
    { title: "Snap them in order", text: "Follow the arrows from power to the end. Magnets hold each module in place and only fit the right way round." },
    { title: "Wear it", text: "Arrange the skin cloth into any shape, preview it on your body, then stick it on with skin-safe tape." }
  ],

  // The "Try a circuit" playground. Wording only; the behavior is in script.js.
  sim: {
    sensors: [
      { id: "none", name: "No sensor", when: "all the time", whenInverted: "never", control: "No sensor, so the signal is always on." },
      { id: "proximity", name: "Proximity", when: "when something comes close", whenInverted: "when nothing is close", control: "Move your hand closer", low: "Far", high: "Close" },
      { id: "light", name: "Light", when: "when the room is bright", whenInverted: "when it gets dark", control: "Room light", low: "Dark", high: "Bright" },
      { id: "touch", name: "Capacitive touch", when: "while you touch it", whenInverted: "until you touch it", control: "Hold to touch" }
    ],
    modifiers: [
      { id: "none", name: "No modifier" },
      { id: "blink", name: "Blink" },
      { id: "fade", name: "Fade" },
      { id: "inverter", name: "Inverter" }
    ],
    actuators: [
      { id: "led", name: "LED", noun: "LED", verb: "lights up", blink: "blinks", fade: "fades in and out" },
      { id: "vibration", name: "Vibration", noun: "vibration motor", verb: "vibrates", blink: "buzzes in short bursts", fade: "swells and fades" },
      { id: "buzzer", name: "Buzzer", noun: "buzzer", verb: "beeps", blink: "beeps on and off", fade: "rises and falls" }
    ]
  },

  // Final projects from the paper's workshop (Fig. 10). chain = modules in order, by name.
  applications: [
    { name: "Night-walk light", where: "Calves", fig: "10C", text: "Two blinking LEDs make the wearer easy to see on a dark street.", chain: ["Main power", "Blink", "LED"] },
    { name: "Personal space alert", where: "Back of the neck", fig: "10D", text: "Vibrates when someone comes too close behind you.", chain: ["Main power", "Proximity", "Vibration"] },
    { name: "Deep-breath reminder", where: "Cheek", fig: "10B", text: "Senses breathing and vibrates to remind you to breathe deeply.", chain: ["Main power", "Pressure", "Vibration"] },
    { name: "Exercise temperature", where: "Chest", fig: "10A", text: "Vibrates when your body gets unusually warm during exercise.", chain: ["Main power", "Temperature", "Vibration"] },
    { name: "Heart transfer", where: "Hand", fig: "10F", text: "Lights up and vibrates when someone holds your hand.", chain: ["Main power", "Light", "LED"] },
    { name: "Ballet pointe trainer", where: "Foot", fig: "10H", text: "Lights up or buzzes when the heel drops too close to the floor.", chain: ["Main power", "Proximity", "Buzzer"] }
  ],

  // Four color families (paper, Fig. 3).
  families: [
    { id: "sensor", name: "Sensors", color: "#F2C230", plain: "Notice something about you or the world." },
    { id: "modifier", name: "Modifiers", color: "#3E7CC9", plain: "Change the signal on its way through." },
    { id: "actuator", name: "Actuators", color: "#FFFFFF", plain: "Do something you can see, hear or feel." },
    { id: "power", name: "Power", color: "#D9443A", plain: "Give the circuit energy." }
  ],

  // The 16 modules from the paper, plus the DIY board shown in Fig. 3.
  modules: [
    { name: "Proximity", family: "sensor", does: "Notices when something comes close." },
    { name: "Light", family: "sensor", does: "Reacts to how bright it is around you." },
    { name: "Capacitive touch", family: "sensor", does: "Notices when you touch its pad." },
    { name: "Temperature", family: "sensor", does: "Feels how warm your skin is." },
    { name: "Pressure", family: "sensor", does: "Senses air pressure, for example a deep breath." },
    { name: "Blink", family: "modifier", does: "Turns a steady signal into on-off blinking." },
    { name: "Fade", family: "modifier", does: "Makes the signal rise and fall smoothly." },
    { name: "Inverter", family: "modifier", does: "Flips the signal: on becomes off, off becomes on." },
    { name: "Volume knob", family: "modifier", does: "Turn it to make the output stronger or weaker." },
    { name: "LED", family: "actuator", does: "Lights up." },
    { name: "Vibration", family: "actuator", does: "Buzzes gently against your skin." },
    { name: "Buzzer", family: "actuator", does: "Makes a sound." },
    { name: "Shape-memory alloy", family: "actuator", does: "A small coil that tightens when it warms up. Needs external power." },
    { name: "Thermochromic", family: "actuator", does: "Changes color when it warms up. Needs external power." },
    { name: "Main power", family: "power", does: "Holds the battery. Every circuit starts here." },
    { name: "External power", family: "power", does: "Extra power for the modules that heat up." },
    { name: "DIY protoboard", family: "power", does: "Lets you add your own components. TODO: confirm it is in the kit." }
  ],

  // ---------- Part 2: Make & use ----------
  paths: {
    make: {
      name: "Make it yourself",
      pitch: "Make the skin cloth and the wire modules that hold everything together, from tattoo paper and conductive tape.",
      note: "The colored circuit modules are made by the lab. TODO: confirm whether their files will be shared."
    },
    use: {
      name: "I have a SkinKit",
      pitch: "Already have a kit? Build a circuit, shape it for your body and wear it.",
      note: ""
    },
    availability: "SkinKit is not for sale right now. Kits are used in Hybrid Body Lab workshops and courses. TODO: confirm wording with the lab."
  },

  // image (optional): a close-up shown when someone clicks that item in the step photo.
  // link (optional): { text, href }. Leave href empty to show "link coming soon" until the file is online.
  materials: {
    make: [
      { name: "Temporary tattoo paper", note: "Silhouette temporary tattoo paper, with the adhesive sheet from its package.", image: "images/mat-tattoo-paper.jpg" },
      { name: "Water-soluble stabilizer", note: "Sulky water-soluble textile stabilizer, the middle layer.", image: "images/mat-stabilizer.jpg" },
      { name: "Plastic scraper", note: "Presses the layers flat and pushes out bubbles." },
      { name: "Scissors and water", note: "" },
      { name: "Electronic cutting machine", note: "Cuts the skin cloth into diamonds with 4 cm sides. We share the cut file, so you can download it and cut the same shapes.", link: { text: "Download the cut file", href: "" } }
    ],
    // Second half of the make path: turning skin cloth into wire modules (step with materials: "modules")
    modules: [
      { name: "Skin cloth diamonds", note: "The pieces you cut in the last step.", image: "images/mat-skin-cloth.jpg" },
      { name: "Conductive fabric tape", note: "Becomes the three lines on each wire module.", image: "images/mat-conductive-tape.jpg" },
      { name: "Mini magnets", note: "2 mm wide, 1 mm thick.", image: "images/mat-magnets.jpg" },
      { name: "Scissors", note: "For cutting the tape into strips." }
    ],
    use: [
      { name: "Circuit modules", note: "The colored blocks, 2 × 2 cm each.", image: "images/mat-circuit-modules.jpg" },
      { name: "Wire modules", note: "Diamond pieces of skin cloth with three metal lines and magnets." },
      { name: "Double-sided tape", note: "Regular tape to fix your layout, and medical-grade tape (e.g. Vapon clear tape) for your skin.", image: "images/mat-tape.jpg" },
      { name: "Scissors and tweezers", note: "Tweezers help separate the tiny magnets." }
    ]
  },

  chapters: [
    { id: "m1", path: "make", name: "Make the skin cloth" },
    { id: "m2", path: "make", name: "Make the wire modules" },
    { id: "u1", path: "use", name: "Get to know the kit" },
    { id: "u2", path: "use", name: "Build a circuit" },
    { id: "u3", path: "use", name: "Shape it and wear it" }
  ],

  // One step = one short looping clip. media: { video: "images/1-01.mp4" } or { image: "images/1-01.jpg" }.
  // marks (optional, video only): key actions in the clip, { t: seconds from the start, text }. Each gets a dot on the progress line, and its text shows under it while it plays.
  // materials: true shows that path's materials list in the step; a name ("modules") shows that list instead.
  steps: [
    { chapter: "m1", shot: "1-01", title: "Gather your materials", text: "Lay out everything below so it is within reach.", materials: true, tip: "", media: {
        image: "images/materials-make.jpg",
        // Clickable things on the photo, in % of its width/height (a dot marks each one; dot: [x, y] in % of the area moves it). item = a name from materials (uses its note and image);
        // label/text/image override or describe things that are not on the list.
        hotspots: [
          { item: "Water-soluble stabilizer", x: 11, y: 6, w: 35, h: 20 },
          { item: "Plastic scraper", x: 47, y: 4, w: 15, h: 19 },
          { item: "Temporary tattoo paper", x: 15, y: 28, w: 29, h: 69 },
          { label: "Adhesive sheets", text: "Come in the tattoo paper package. One goes on the shiny side of each tattoo paper.", image: "images/mat-adhesive.jpg", x: 47, y: 29, w: 28, h: 66 },
          { label: "Scissors", text: "For cutting the stabilizer to the size of the paper.", x: 74, y: 16, w: 12, h: 51 }
        ]
      } },
    { chapter: "m1", shot: "1-02", title: "Add adhesive to two tattoo papers", text: "Take two sheets of temporary tattoo paper. On the shiny silicone side of each, apply the double-sided adhesive sheet that comes in the package.", tip: "", media: { video: "images/1-02.mp4", marks: [
          { t: 0, text: "Peel the backing off the adhesive sheet" },
          { t: 3.5, text: "Lay it on the shiny side of the tattoo paper" },
          { t: 6.5, text: "Scrape out the bubbles" },
          { t: 10, text: "Repeat on the second sheet" }
        ] } },
    { chapter: "m1", shot: "1-03", title: "Sandwich the stabilizer", text: "Cut a piece of water-soluble stabilizer the same size as the paper. Stick one tattoo paper on each side of it, adhesive facing in. Press out any bubbles.", tip: "Press from the center outward. Bubbles weaken the layers.", media: { video: "images/1-03.mp4", marks: [
          { t: 0, text: "Lay down the stabilizer and smooth it flat" },
          { t: 4, text: "Add a tattoo paper on top" },
          { t: 7.5, text: "Press out the bubbles" },
          { t: 11, text: "Done: three layers pressed together" }
        ] } },
    { chapter: "m1", shot: "1-04", title: "Peel, dry and cut", text: "Wet both sides with water. The paper backings will lift off easily. Let it dry, then cut it into diamonds with a cutting machine. This is your skin cloth.", tip: "The diamonds have 4 cm sides and edges that fit into each other like a puzzle.", media: { video: "images/1-04.mp4", marks: [
          { t: 0, text: "Wet the paper backing" },
          { t: 3.5, text: "Peel the backing off slowly" },
          { t: 11, text: "Let it dry" }
        ] } },
    { chapter: "m2", shot: "1-05m", title: "Gather your materials", text: "Now turn the skin cloth into wire modules. Lay out everything below.", materials: "modules", tip: "", media: {
        image: "images/materials-modules.jpg",
        hotspots: [
          { item: "Mini magnets", x: 12.5, y: 22.8, w: 19, h: 26.7 },
          { item: "Conductive fabric tape", x: 38.4, y: 15.6, w: 18.8, h: 13.3 },
          { item: "Scissors", x: 58.4, y: 10, w: 25.6, h: 20.6 },
          { item: "Skin cloth diamonds", x: 38, y: 38.3, w: 46, h: 50.6, dot: [49, 20] }
        ]
      } },
    { chapter: "m2", shot: "1-05", title: "Add the three lines", text: "TODO: how to lay the three strips of conductive fabric tape (power, ground, signal) on the skin cloth.", tip: "", media: { video: "images/1-05.mp4", marks: [
          { t: 0, text: "Lay a strip of conductive tape across the diamond" },
          { t: 4, text: "Add the next line" },
          { t: 8, text: "Fold the ends over the edge" },
          { t: 12, text: "Three lines: power, ground, signal" }
        ] } },
    { chapter: "m2", shot: "1-07", title: "Add the magnets", text: "TODO: where the magnets go under the lines, and which way they face.", tip: "", media: { video: "images/1-07.mp4", marks: [
          { t: 0, text: "Put magnets in the module's pin holes" },
          { t: 3.5, text: "Press clear tape over them" },
          { t: 7, text: "Line the magnets up with tweezers" },
          { t: 10.5, text: "Three magnets in a row" },
          { t: 13.5, text: "One strip at each end of the diamond" }
        ] } },

    { chapter: "u1", shot: "2-00", title: "Gather your materials", text: "Lay out everything below so it is within reach.", materials: true, tip: "", media: {
        image: "images/materials-use.jpg",
        hotspots: [
          { item: "Mini magnets", x: 8, y: 15, w: 26, h: 45, dot: [80, 55] },
          { item: "Conductive fabric tape", x: 40, y: 19, w: 17, h: 14 },
          { label: "Scissors", text: "For trimming tape and skin cloth.", x: 57, y: 15, w: 23, h: 21 },
          { label: "Skin cloth", text: "Tattoo paper and stabilizer pressed together. The base of every wire module.", image: "images/mat-skin-cloth.jpg", x: 39, y: 38, w: 40, h: 46, dot: [50, 23] },
          { item: "Double-sided tape", x: 23, y: 62, w: 15, h: 20 },
          { item: "Circuit modules", x: 67, y: 67, w: 15, h: 15 }
        ]
      } },
    { chapter: "u1", shot: "1-06", title: "Meet the modules", text: "Every circuit module has a color. Yellow senses, blue changes the signal, white acts, and red powers the circuit. Arrows printed on each module show which way the signal goes.", tip: "Part 1 has a guide to all 16 modules.", media: null },
    { chapter: "u1", shot: "2-01", title: "Follow the arrows", text: "There is one rule: the signal always flows in the direction of the arrows, from power to the end. Line up the arrows on the circuit modules with the arrows on the wire modules. The magnets only snap together the right way round.", tip: "", media: null },
    { chapter: "u2", shot: "2-02", title: "Start with power and an LED", text: "Connect Main power to an LED and switch it on. The LED lights up. Try this on the table first: it is the easiest way to test.", tip: "", media: null },
    { chapter: "u2", shot: "2-03", title: "Add a sensor", text: "Put a Proximity sensor between the power and the LED. Now the LED only lights up when something comes close to the sensor.", tip: "", media: null },
    { chapter: "u2", shot: "2-04", title: "Add a modifier", text: "Put a Blink module between the sensor and the LED. Now the LED blinks when something comes close. Swap modules or change their order to see what else you can make.", tip: "Nothing happens? Check every arrow points the same way and the magnets are snapped together.", media: null },
    { chapter: "u3", shot: "3-01", title: "Decide where to wear it", text: "Where on your body will it go? Is that spot flat or curved? How many modules will you use? What shape fits that spot best?", tip: "Forearm and wrist are good first choices: easy to reach and easy to see.", media: null },
    { chapter: "u3", shot: "3-02", title: "Lay out the wire modules", text: "Fit the diamond wire modules together into the shape you want. Use the cross-shaped piece to turn a corner or split the circuit in two, and blank pieces for decoration.", tip: "", media: null },
    { chapter: "u3", shot: "3-03", title: "Pick a connection", text: "On curved spots, connect two pieces that have flaps and set the module on the flaps, so it stays connected when you bend. On flat spots, use flat pieces for a slimmer look. To extend the circuit without a module, fold a flap onto a flat piece.", tip: "", media: null },
    { chapter: "u3", shot: "3-04", title: "Preview it on your body", text: "Hold the device on your body and look in the mirror. Rearrange pieces or swap modules until you like it.", tip: "", media: null },
    { chapter: "u3", shot: "3-05", title: "Make it permanent and decorate", text: "When the layout is final, secure the joints between wire modules with double-sided tape. Then, if you like, decorate it with washi tape, stickers, gems or markers.", tip: "Keep decorations off the magnets and metal lines so the circuit still works.", media: null },
    { chapter: "u3", shot: "3-06", title: "Put it on", text: "Apply medical-grade double-sided tape to the back and press the device onto clean, dry skin. Switch on the power and try it out.", tip: "", media: null },
    { chapter: "u3", shot: "3-07", title: "Take it off", text: "TODO: how to remove it gently and store the modules for reuse.", tip: "The circuit modules are reusable: unsnap them for your next project.", media: null }
  ],

  glossary: [
    { term: "Circuit", meaning: "A path that electricity flows along. Here, a chain of modules." },
    { term: "Signal", meaning: "The message passed from one module to the next." },
    { term: "Skin cloth", meaning: "The thin, soft base made from tattoo paper and stabilizer." },
    { term: "Wire module", meaning: "A piece of skin cloth with three metal lines (power, ground, signal) that carries power and signals." },
    { term: "PCB / FPCB", meaning: "(Flexible) printed circuit board: the thin board each colored module is built on." },
    { term: "Tessellation", meaning: "Fitting identical shapes together with no gaps, like tiles." }
  ],

  safety: [
    "Wear SkinKit on clean, healthy skin only, using medical-grade tape.",
    "Take it off if your skin itches or turns red.",
    "Keep it away from water.",
    "The shape-memory alloy and thermochromic modules heat up when active. TODO: wear-time guidance from the lab."
  ],

  // Questions people ask. confirm: true shows a "To confirm" tag until the lab checks the answer;
  // an empty a shows "We are checking this with the lab."
  faq: [
    { q: "How long can I wear it?", a: "", confirm: true },
    { q: "How do I take it off? Does it hurt?", a: "Peel it off slowly from one corner while holding the skin flat, the way you take off a bandage. The video shows how.", confirm: true },
    { q: "Can it get wet? What about sweat?", a: "Keep it away from water.", confirm: true },
    { q: "Can I use it on sensitive skin?", a: "SkinKit sticks on with medical-grade double-sided tape (Vapon). If your skin itches or turns red, take it off.", confirm: true },
    { q: "Can I reuse the modules and wire modules?", a: "The circuit modules can be unsnapped and used again in your next project. Whether the wire modules can be reused is still being checked.", confirm: true },
    { q: "What battery does it use, and how long does it last?", a: "", confirm: true },
    { q: "I connected everything but nothing lights up. What now?", a: "Check that every arrow points the same way, from the power module to the end, and that every magnet is snapped on firmly.", confirm: false },
    { q: "Where can I get a SkinKit?", a: "SkinKit is not for sale right now. Kits are used in Hybrid Body Lab workshops and courses.", confirm: true },
    { q: "Do any modules get hot?", a: "The shape-memory alloy and thermochromic modules get warm while they are working.", confirm: true }
  ],

  citation: {
    text: "Pin-Sung Ku, Md. Tahmidul Islam Molla, Kunpeng Huang, Priya Kattappurath, Krithik Ranjan, Hsin-Liu (Cindy) Kao. SkinKit: Construction Kit for On-Skin Interface Prototyping. Proc. ACM IMWUT 5(4), Article 165, December 2021.",
    doi: "https://doi.org/10.1145/3494989",
    funding: "Supported by NSF grant IIS #2047249.",
    project: "https://www.hybridbody.human.cornell.edu/skinkit"
  }
};
