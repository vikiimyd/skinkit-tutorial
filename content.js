// All text on the page lives here. Edit this file to change what the page says;
// index.html and script.js do not need to change.
// Facts come from the SkinKit paper (Ku et al., IMWUT 2021). "TODO" marks what the paper
// does not say and still needs to be confirmed with the mentor.
// shot: the clip ID from the shot list. Put the exported clip in images/ and set media.

window.SKINKIT = {
  // ---------- Part 1: Introduction ----------
  // Each part of the Introduction says its point in one sentence (viki 11/10); details live in the Make and Use steps.
  // The intro says what SkinKit is and what it is for. The counts (5 + 1 wire modules, 16 electronic modules)
  // come right after it, in "About the kit", so they are not repeated here.
  // Then "parts" introduces the two paths, Make and Use (their names and pitches are in paths below).
  headline: "Electronics you wear like a temporary tattoo.",
  intro: "SkinKit is a construction kit for building interactive devices that sit right on your skin, so anyone can try out an idea on the body quickly, with no coding and no soldering.",
  parts: {
    title: "The tutorial: Make and Use",
    lead: "This tutorial has two parts: Make, for those who fabricate their own skin cloth and wire modules, and Use, for everyone."
  },
  overviewVideo: { youtube: "https://youtu.be/Er8yJwxMnp4", shot: "0-00" }, // the lab's SkinKit video, as on the SkinKit page of the lab site

  // The three steps of the prototyping workflow in the paper (section 3.5)
  how: [
    { title: "Build the circuit", text: "Line up electronic modules in order, starting with a power module." },
    { title: "Lay it out with wire modules", text: "Fit wire modules into a shape and click the electronic modules on, with every arrow pointing the same way." },
    { title: "Wear and preview it", text: "Try it on your body, move the modules until it fits, then fix it with medical-grade tape." }
  ],

  // "What's in the kit", right under the intro: an overview only (the details are in the Make and Use steps).
  // Two cards, each with one overview image. count is the big number on the card; highlight (optional) is a line shown in bold under a card's text.
  kit: [
    { count: "5 + 1", name: "Wire modules", image: "images/kit-wire-modules.jpg", text: "Diamonds of skin cloth that carry power, signal and ground between electronic modules, in five shapes plus a blank piece to decorate." },
    { count: "16", name: "Electronic modules", image: "images/kit-electronic-modules.jpg", text: "Small flexible circuit boards that click on with magnets: 5 sensors, 4 modifiers, 5 actuators and 2 power modules.", highlight: "You can also make the ones you need yourself." }
  ],

  // "How the modules connect" (paper section 3.3 and Fig. 1, Fig. 7). Shown in the "Use the kit" path:
  // the diagram and points on the step with block: "connect", the three joins on the step with block: "joins".
  connect: {
    diagram: { image: "images/connect-exploded.jpg", alt: "Exploded view of one joint: top magnets, the flexible circuit board with its colored chip, the flap of the wire module, and the bottom magnets under the metal lines.", caption: "One joint, pulled apart. Diagram from the SkinKit paper (Ku et al., IMWUT 2021, Fig. 1)." },
    points: [
      { title: "Magnets clamp the lines", text: "Six magnets on the circuit module line up with six magnets under the wire modules' metal lines. They pull together through the board and the lines, pressing them into a solid electric contact." },
      { title: "It only fits one way", text: "The two rows of magnets have opposite poles, so a module only clicks on in the direction the signal flows. Arrows on the modules show which way that is." },
      { title: "Lift it off to reuse it", text: "Pull a module off and snap it on somewhere else. You can rearrange the pieces as often as you like." }
    ],
    typesTitle: "Three ways to join pieces",
    types: [
      { name: "With flaps", image: "images/connect-flaps.png", text: "Two wire modules with flaps meet edge to edge, and the circuit module sits on both flaps. The flaps bend with you, so use this on curved parts of the body." },
      { name: "Without flaps", image: "images/connect-flat.png", text: "Two flat wire modules, with the circuit module laid across both. Slimmer, for flat, smooth parts of the body." },
      { name: "Wire to wire", image: "images/connect-wire.png", text: "A flap folds onto a flat module and their magnets meet. No circuit module here: use it to extend the circuit, go around a part of the body, or change the shape." }
    ],
    rule: "The one rule: keep the signal going one way. Line up the arrows on every piece.",
    credit: "Drawings from the SkinKit paper (Ku et al., IMWUT 2021, Fig. 7)."
  },

  // Lab photos of SkinKit on the body (press images "7_SkinKit_*_example"). pos = CSS object-position, keeps the device in frame.
  examples: [
    { label: "Chest", image: "images/ex-chest.jpg", pos: "48% 62%" },
    { label: "Shoulder", image: "images/ex-shoulder.jpg", pos: "28% 56%" },
    { label: "Back of the neck", image: "images/ex-neck.jpg", pos: "52% 50%" },
    { label: "Hand", image: "images/ex-hand.jpg", pos: "55% 50%" },
    { label: "Leg", image: "images/ex-leg.jpg", pos: "65% 40%" }
  ],

  // Four color families (paper, Fig. 3).
  families: [
    { id: "sensor", name: "Sensors", color: "#F2C230", plain: "Notice something about you or the world." },
    { id: "modifier", name: "Modifiers", color: "#3E7CC9", plain: "Change the signal on its way through." },
    { id: "actuator", name: "Actuators", color: "#FFFFFF", plain: "Do something you can see, hear or feel." },
    { id: "power", name: "Power", color: "#D9443A", plain: "Give the circuit energy." }
  ],

  // The 16 modules from the paper, plus the DIY board shown in Fig. 3.
  // image = photo of the module (lab press image "2_FPCB_modules").
  modules: [
    { name: "Proximity", family: "sensor", does: "Notices when something comes close.", image: "images/fpcb-proximity.jpg" },
    { name: "Light", family: "sensor", does: "Reacts to how bright it is around you.", image: "images/fpcb-light.jpg" },
    { name: "Capacitive touch", family: "sensor", does: "Notices when you touch its pad.", image: "images/fpcb-capacitive-touch.jpg" },
    { name: "Temperature", family: "sensor", does: "Feels how warm your skin is.", image: "images/fpcb-temperature.jpg" },
    { name: "Pressure", family: "sensor", does: "Senses air pressure, for example a deep breath.", image: "images/fpcb-pressure.jpg" },
    { name: "Blink", family: "modifier", does: "Turns a steady signal into on-off blinking.", image: "images/fpcb-blink.jpg" },
    { name: "Fade", family: "modifier", does: "Makes the signal rise and fall smoothly.", image: "images/fpcb-fade.jpg" },
    { name: "Inverter", family: "modifier", does: "Flips the signal: on becomes off, off becomes on.", image: "images/fpcb-inverter.jpg" },
    { name: "Volume knob", family: "modifier", does: "Turn it to make the output stronger or weaker.", image: "images/fpcb-volume.jpg" },
    { name: "LED", family: "actuator", does: "Lights up.", image: "images/fpcb-led.jpg" },
    { name: "Vibration", family: "actuator", does: "Buzzes gently against your skin.", image: "images/fpcb-vibration.jpg" },
    { name: "Buzzer", family: "actuator", does: "Makes a sound.", image: "images/fpcb-buzzer.jpg" },
    { name: "Shape-memory alloy", family: "actuator", does: "A small coil that tightens when it warms up. Needs external power.", image: "images/fpcb-sma.jpg" },
    { name: "Thermochromic", family: "actuator", does: "Changes color when it warms up. Needs external power.", image: "images/fpcb-thermochromic.jpg" },
    { name: "Main power", family: "power", does: "Holds the battery. Every circuit starts here.", image: "images/fpcb-main-power.jpg" },
    { name: "External power", family: "power", does: "Extra power for the modules that heat up.", image: "images/fpcb-external-power.jpg" },
    { name: "DIY protoboard", family: "power", does: "Lets you add your own components. TODO: confirm it is in the kit.", image: "images/fpcb-diy-protoboard.jpg" }
  ],

  // ---------- Part 2: Make & use ----------
  paths: {
    // highlight (optional): a key point shown in bold on the path card.
    // audience: the small line above each path's name. Everyone learns Use; only kit makers need Make.
    make: {
      name: "Make the kit",
      audience: "For kit makers",
      pitch: "Make the skin cloth and the wire modules that hold everything together, from tattoo paper, magnets and conductive tape.",
      highlight: "You make two sheets of skin cloth: one to cut with the machine, one to cut with scissors.",
      note: ""
    },
    use: {
      name: "Use the kit",
      audience: "For everyone",
      pitch: "Learn how the modules connect, build a circuit, shape it for your body and wear it.",
      note: ""
    },
    availability: "SkinKit is not for sale right now. Kits are used in Hybrid Body Lab workshops and courses."
  },

  // image (optional): a close-up shown when someone clicks that item in the step photo.
  // link (optional): { text, href }. Leave href empty to show "link coming soon" until the file is online.
  materials: {
    make: [
      { name: "Temporary tattoo paper", note: "Silhouette temporary tattoo paper, with the adhesive sheet from its package. You need four: two for each skin cloth sheet.", image: "images/mat-tattoo-paper.jpg" },
      { name: "Water-soluble stabilizer", note: "Sulky water-soluble textile stabilizer, the middle layer.", image: "images/mat-stabilizer.jpg" },
      { name: "Plastic scraper", note: "Presses the layers flat and pushes out bubbles." },
      { name: "Scissors and water", note: "" },
      { name: "Foam brush", note: "Spreads water over the paper backing so it lifts off." },
      { name: "Electronic cutting machine", note: "Cuts the skin cloth into diamonds with 4 cm sides. We share the cut file, so you can download it and cut the same shapes.", link: { text: "Download the cut file", href: "" } }
    ],
    // Second half of the make path: turning skin cloth into wire modules (step with materials: "modules")
    modules: [
      { name: "Skin cloth diamonds", note: "The pieces you cut in the last step.", image: "images/mat-skin-cloth.jpg" },
      { name: "Second skin cloth sheet", note: "The Letter-size sheet you kept whole. The magnets go on it, then you cut it apart with scissors.", image: "images/mat-skin-cloth.jpg" },
      { name: "Magnet template", note: "US Letter paper (8.5 × 11 in). Print at 100% / actual size, not Fit to page. It shows where every magnet goes.", link: { text: "Download the PDF (US Letter)", href: "downloads/skinkit-magnet-sheet-v9.pdf" } },
      { name: "Conductive fabric tape", note: "Becomes the three lines on each wire module.", image: "images/mat-conductive-tape.jpg" },
      { name: "Mini magnets", note: "2 mm wide, 1 mm thick.", image: "images/mat-magnets.jpg" },
      { name: "Scissors", note: "For cutting the tape and the magnet sheet into strips." },
      { name: "Double-sided tape", note: "Covers the second skin cloth sheet, and cut into small triangles for the corners of each diamond.", image: "images/mat-tape-roll-2.jpg" },
      { name: "Tweezers", note: "For placing and lining up the tiny magnets.", image: "images/mat-tweezers-3.jpg" },
      { name: "Masking or washi tape", note: "Holds the skin cloth sheet still on the template." }
    ],
    use: [
      { name: "Circuit modules", note: "The colored blocks, 2 × 2 cm each.", image: "images/mat-circuit-modules.jpg" },
      { name: "Wire modules", note: "Diamond pieces of skin cloth with three metal lines and magnets." },
      { name: "Double-sided tape", note: "Regular tape to fix your layout, and medical-grade tape (e.g. Vapon clear tape) for your skin.", image: "images/mat-tape.jpg" },
      { name: "Scissors and tweezers", note: "Tweezers help separate the tiny magnets." }
    ]
  },

  chapters: [
    { id: "m1", path: "make", name: "Make two sheets of skin cloth" },
    // byType: after the step with choices, the chapter's steps are done once per wire module type,
    // and the step list shows one group per type.
    { id: "m2", path: "make", name: "Make the wire modules", byType: true },
    { id: "u1", path: "use", name: "Get to know the kit" },
    { id: "u2", path: "use", name: "Build a circuit" },
    { id: "u3", path: "use", name: "Shape it and wear it" }
  ],

  // One step = one short looping clip. media: { video: "images/1-01.mp4" } or { image: "images/1-01.jpg" }.
  // marks (optional, video only): key actions in the clip, { t: seconds from the start, text }. Each gets a dot on the progress line, and its text shows under it while it plays.
  // materials: true shows that path's materials list in the step; a name ("modules") shows that list instead.
  // choices (optional): cards shown under the text, { id, name, image, text, go }. go = shot of the step a card opens (it also picks that type).
  // callout (optional): a key point shown in bold in a box before the step text.
  // forType (optional): a note per wire module type, shown with a type picker. media: false hides the media box.
  // wireBase: the wire module type the step videos show; it is picked by default. For other types, a step with forType
  // shows a blank video box and only their own note (none yet: left blank until they are filmed).
  // need (optional): what this step uses, shown as "You need" under the text. A name from the materials lists
  // reuses that item's photo; { name, note, image } adds a one-off. Leave it out on "Gather your materials" steps.
  wireBase: "double-flaps",
  steps: [
    { chapter: "m1", shot: "1-01", title: "Gather your materials", callout: "You make two sheets of skin cloth: one for the cutting machine to cut into diamonds, and one for the magnets that you cut with scissors.", text: "Lay out everything below so it is within reach. The list is for both sheets.", materials: true, tip: "", media: {
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
    { chapter: "m1", shot: "1-02", title: "Add adhesive to two tattoo papers", text: "Take two sheets of temporary tattoo paper. On the shiny silicone side of each, apply the double-sided adhesive sheet that comes in the package. You end up with two identical sheets, each with adhesive on its shiny side.", tip: "", need: ["Temporary tattoo paper", { name: "Adhesive sheets", note: "From the tattoo paper package", image: "images/mat-adhesive.jpg" }, "Plastic scraper"], media: { video: "images/1-02-v5.mp4", marks: [
          { t: 0, text: "Peel the backing off the adhesive sheet" },
          { t: 4.5, text: "Lay it on the shiny side of the tattoo paper" },
          { t: 10.5, text: "Scrape out the bubbles" },
          { t: 13.9, text: "Repeat on the second sheet" }
        ] } },
    { chapter: "m1", shot: "1-03", title: "Sandwich the stabilizer", text: "Cut a piece of water-soluble stabilizer the same size as the paper. Stick one tattoo paper on each side of it, adhesive facing in. Press out any bubbles.", tip: "Press from the center outward. Bubbles weaken the layers.", need: [{ name: "The two tattoo papers from the last step", image: "images/mat-tattoo-paper.jpg" }, "Water-soluble stabilizer", "Scissors", "Plastic scraper"], media: { video: "images/1-03-v5.mp4", marks: [
          { t: 0, text: "Lay the first tattoo paper on the stabilizer, adhesive side down" },
          { t: 5.9, text: "Press out the bubbles" },
          { t: 8.65, text: "Flip it over" },
          { t: 10.9, text: "Add the second tattoo paper on the other side" },
          { t: 17.4, text: "Press out the bubbles again" }
        ] } },
    { chapter: "m1", shot: "1-04", title: "Peel and dry", text: "Wet both sides with water. The paper backings will lift off easily. Let it dry for a few days. This is your skin cloth. Repeat Steps 2 to 4 to make the second sheet.", tip: "", need: ["Water", "Foam brush"], media: { video: "images/1-04-v5.mp4", marks: [
          { t: 0, text: "Wet the paper backing" },
          { t: 5.5, text: "Flip it over" },
          { t: 7.6, text: "Wet the other side" },
          { t: 12, text: "Peel the backing papers off slowly" },
          { t: 21.2, text: "Let it dry for a few days" }
        ] } },
    { chapter: "m1", shot: "1-04c", title: "Cut it into diamonds", callout: "One sheet is for cutting. Save the other sheet whole for the next stage.", text: "Load one dry sheet of skin cloth into an electronic cutting machine and cut it with our cut file, the template for the diamond shape. Every piece then fits the others. The saved sheet holds the magnets in Make the wire modules.", tip: "The diamonds have 4 cm sides and edges that fit into each other like a puzzle.", need: ["Electronic cutting machine"], media: null },
    { chapter: "m2", shot: "1-05t", title: "Choose the modules you are going to make", text: "Every wire module starts as a skin cloth diamond. SkinKit has five types of wire module plus a blank one. Pick the ones your design needs, and make several of each. Pick one to see how to make it.", tip: "The arrow sticker shows which way the signal flows. When you lay the pieces out, keep every arrow following the same direction, from input to output.", choices: [
        { id: "flat", name: "Flat", image: "images/wire-flat.jpg", go: "1-05m", text: "No flap. The slimmest connection, for flat, smooth spots on the body." },
        { id: "flap-in", name: "Flap-in", image: "images/wire-flap-in.jpg", go: "1-05m", text: "Has a flap on the side the arrow comes from. A flap is an extra strip of skin cloth that bends like a hinge, so a circuit module sitting on it stays connected on curvy spots." },
        { id: "flap-out", name: "Flap-out", image: "images/wire-flap-out.jpg", go: "1-05m", text: "Like Flap-in, but the flap is on the side the arrow points to. Its magnets are flipped to match the signal direction, from input to output." },
        { id: "double-flaps", name: "Double flaps", tag: "Shown in the videos", image: "images/wire-double-flaps.jpg", go: "1-05m", text: "A flap on both sides: Flap-in and Flap-out in one piece." },
        { id: "cross", name: "Cross shape", image: "images/wire-cross-v2.jpg", go: "1-05m", text: "A four-way piece. Turns the circuit or splits it into two directions." },
        { id: "blank", name: "Blank", image: "images/wire-blank.jpg", text: "Plain skin cloth with no lines or magnets. For decoration, and to fill out the shape you wear. Nothing to add: use a diamond from Step 5 as it is." }
      ], media: false },
    { chapter: "m2", shot: "1-05m", title: "Gather your materials", text: "Now turn the skin cloth into wire modules. Lay out everything below.", materials: "modules", forType: {
      "double-flaps": "The videos in the next steps show how to make this one."
    }, tip: "", media: {
        image: "images/materials-modules-6.jpg",
        hotspots: [
          { item: "Mini magnets", x: 12.5, y: 22.8, w: 19, h: 26.7 },
          { item: "Conductive fabric tape", x: 38.4, y: 15.6, w: 18.8, h: 13.3 },
          { item: "Scissors", x: 58.4, y: 10, w: 25.6, h: 20.6 },
          { item: "Skin cloth diamonds", x: 38, y: 38.3, w: 46, h: 50.6, dot: [49, 20] },
          { item: "Double-sided tape", x: 15.6, y: 62.7, w: 13.6, h: 23 },
          { item: "Tweezers", x: 8.3, y: 8.5, w: 28.4, h: 8 }
        ]
      } },
    { chapter: "m2", shot: "1-05c", title: "Tape the corners", text: "Start with a skin cloth diamond you cut in Step 5. Cut small triangles from the double-sided tape and stick one on each corner of the diamond. Leave the backing on: you peel it off later, when you want to stick pieces together for good.", tip: "", need: ["Skin cloth diamonds", "Double-sided tape", "Scissors"], media: { video: "images/1-05c-v4.mp4", marks: [
          { t: 0, text: "Cut the double-sided tape into small triangles" },
          { t: 8.2, text: "Stick a triangle on each corner of the diamond" },
          { t: 19.3, text: "Leave the backing on for now" }
        ] } },
    { chapter: "m2", shot: "1-07a", title: "Lay the skin cloth over the template", text: "Cover one side of your second skin cloth sheet with double-sided tape. Print the magnet template on US Letter paper at 100% (actual size, not Fit to page), lay the skin cloth over it with the tape side up, and tape all four edges down with masking or washi tape so it cannot move. Skin cloth is see-through, so the pattern shows.", tip: "One sheet holds 64 pairs of short strips, the magnets for up to 64 wire modules (a Cross uses two pairs), so you place them all in one go.", need: ["Second skin cloth sheet", "Double-sided tape", "Magnet template", "Masking or washi tape"], media: { image: "images/magnet-sheet-v9.jpg" } },
    { chapter: "m2", shot: "1-07", title: "Place the magnets", text: "Put a magnet on every dot with tweezers. Black dots are one face up. White dots are flipped, so their pole is opposite. You don't need to mark anything: the template shows where each magnet goes.", tip: "Which face is N does not matter. The black and white ends of each module just need to be opposite.", need: ["Mini magnets", "Tweezers"], media: { video: "images/1-07-v7.mp4", marks: [
          { t: 0, text: "The two rows have opposite poles" },
          { t: 4.77, text: "Put a magnet on each dot with tweezers" },
          { t: 8.8, text: "Keep going until every dot has a magnet" },
          { t: 13.8, text: "Line the magnets up with tweezers" }
        ] } },
    { chapter: "m2", shot: "1-07b", title: "Cut the sheet into strips", text: "Cut the sheet into short strips with scissors along the solid lines, through the skin cloth and the paper together. Then peel the paper off the back of each strip. Each wire module needs one black strip and one white strip.", forType: {
      "cross": "A Cross needs four strips, one per arm: two black and two white."
    }, tip: "", need: ["Scissors"], media: false },
    { chapter: "m2", shot: "1-07c", title: "Stick the strips on", text: "Stick the black strip at the input end of the diamond and the white strip at the output end. Line up the plain edge of each strip (the one without red marks) with the edge of the inner square: on a flap end the strip covers the flap, on a flat end it sits just inside the square. The red arrows on the template point the way the signal flows.", forType: {
      "flat": "Both ends are flat, so both strips sit just inside the inner square: black at the input end, white at the output end.",
      "flap-in": "The black strip covers the flap on the input side. The white strip sits just inside the square at the output end.",
      "flap-out": "The black strip sits just inside the square at the input end. The white strip covers the flap on the output side.",
      "double-flaps": "One strip covers each flap: black on the input flap, white on the output flap.",
      "cross": "One strip on each of the four arms: black on the input arms, white on the output arms."
    }, tip: "", need: ["Skin cloth diamonds"], media: { video: "images/1-07c-v1.mp4", marks: [
          { t: 0, text: "Stick a strip at each end of the diamond" }
        ] } },
    { chapter: "m2", shot: "1-05", title: "Add the three lines", text: "Peel the backing off a strip of conductive fabric tape. Stick it across the diamond so it covers one magnet at each end, and fold each end around the edge of the flap. Repeat twice more for three lines: power, ground and signal.", forType: {
      "double-flaps": "Run each line from one flap across to the other."
    }, tip: "", need: ["Skin cloth diamonds", "Conductive fabric tape", "Scissors"], media: { video: "images/1-05-v3.mp4", marks: [
          { t: 0, text: "Peel the backing off a strip of conductive tape" },
          { t: 6.7, text: "Stick it down over a magnet on one flap" },
          { t: 10.5, text: "Press it flat and fold the end around the edge" },
          { t: 16.1, text: "Do the same on the other flap" },
          { t: 20, text: "That's one line" },
          { t: 22, text: "Repeat twice more for three lines" }
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
    { chapter: "u1", shot: "1-06", title: "Meet the modules", text: "There are 16 circuit modules, and each color is a different kind of job. Yellow senses, blue changes the signal, white acts, and red powers the circuit. Arrows printed on each module show which way the signal goes. You can use ready-made modules or make your own. Tap a color below to see only that kind.", tip: "", need: ["Circuit modules"], block: "modules", media: false },
    { chapter: "u1", shot: "1-06c", title: "How the modules connect", text: "A circuit module sits across two wire modules. Magnets do all the joining, so nothing is sewn or soldered, and every piece comes apart again.", block: "connect", tip: "", media: false },
    { chapter: "u1", shot: "2-01", title: "Follow the arrows", text: "There is one rule: the signal always flows in the direction of the arrows, from power to the end. Line up the arrows on the circuit modules with the arrows on the wire modules. The magnets only snap together the right way round.", tip: "", need: ["Circuit modules", "Wire modules"], media: null },
    { chapter: "u2", shot: "2-02", title: "Start with power and an LED", text: "Connect Main power to an LED and switch it on. The LED lights up. Try this on the table first: it is the easiest way to test.", tip: "", need: [{ name: "Main power and LED modules", image: "images/mat-circuit-modules.jpg" }, "Wire modules"], media: null },
    { chapter: "u2", shot: "2-03", title: "Add a sensor", text: "Put a Proximity sensor between the power and the LED. Now the LED only lights up when something comes close to the sensor.", tip: "", need: [{ name: "A Proximity module", image: "images/mat-circuit-modules.jpg" }, "Wire modules"], media: null },
    { chapter: "u2", shot: "2-04", title: "Add a modifier", text: "Put a Blink module between the sensor and the LED. Now the LED blinks when something comes close. Swap modules or change their order to see what else you can make.", tip: "Nothing happens? Check every arrow points the same way and the magnets are snapped together.", need: [{ name: "A Blink module", image: "images/mat-circuit-modules.jpg" }, "Wire modules"], media: null },
    { chapter: "u3", shot: "3-01", title: "Decide where to wear it", text: "Where on your body will it go? Is that spot flat or curved? How many modules will you use? What shape fits that spot best?", tip: "Forearm and wrist are good first choices: easy to reach and easy to see.", media: null },
    { chapter: "u3", shot: "3-02", title: "Lay out the wire modules", text: "Fit the diamond wire modules together into the shape you want. Use the cross-shaped piece to turn a corner or split the circuit in two, and blank pieces for decoration.", tip: "", need: ["Wire modules"], media: null },
    { chapter: "u3", shot: "3-03", title: "Pick a connection", text: "Choose how each pair of pieces joins, depending on the spot on your body and what the circuit needs there.", block: "joins", tip: "", need: ["Wire modules"], media: false },
    { chapter: "u3", shot: "3-04", title: "Preview it on your body", text: "Hold the device on your body and look in the mirror. Rearrange pieces or swap modules until you like it.", tip: "", media: null },
    { chapter: "u3", shot: "3-05", title: "Make it permanent and decorate", text: "When the layout is final, secure the joints between wire modules with double-sided tape. Then, if you like, decorate it with washi tape, stickers, gems or markers.", tip: "Keep decorations off the magnets and metal lines so the circuit still works.", need: ["Double-sided tape", { name: "Decorations (optional)", note: "Washi tape, stickers, gems or markers" }], media: null },
    { chapter: "u3", shot: "3-06", title: "Put it on", text: "Apply medical-grade double-sided tape to the back and press the device onto clean, dry skin. Switch on the power and try it out.", tip: "", need: [{ name: "Medical-grade double-sided tape", image: "images/mat-tape.jpg" }], media: null },
    { chapter: "u3", shot: "3-07", title: "Take it off", text: "Peel it off slowly from one corner while holding the skin flat, the way you take off a bandage. Unsnap the electronic modules and keep them for your next project. The wire modules can't be reused once they have been stuck on skin.", tip: "Avoid hairy parts of the body when you put it on: taking it off there hurts.", media: null }
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
    "Modules can get hot if there is a short circuit, so connect and test the circuit on a table before you put it on your body. The shape-memory alloy and thermochromic modules also get warm while they work."
  ],

  // Questions people ask. confirm: true shows a "To confirm" tag until the lab checks the answer;
  // an empty a shows "We are checking this with the lab."
  // demo (optional): a small interactive under the answer ("order" or "arrows", drawn in script.js).
  // steps (optional): a numbered list shown under the answer.
  // source (optional): where the answer comes from, shown under it. image (optional): { src, alt, caption }, a photo under the answer.
  faq: [
    { q: "Does the order of the modules matter?", a: "Yes. Every circuit starts with a power module, which always sends out a full signal. Each module after it reacts to the signal it gets from the module before it, then passes a signal on to the next one. So an output, like an LED, placed right after the power module and before any sensor gets the full signal and is always on. Placed after a sensor, it only turns on when the sensor's condition is met: in power → proximity sensor → LED, the LED lights up only when something comes close. With two sensors in a row, the LED needs both: in power → proximity sensor → touch sensor → LED, it lights up only when something is close and the touch sensor is touched at the same time. Move the LED and try the sensors below.", demo: "order", source: "SkinKit paper, sections 3.1 and 3.5", confirm: false },
    { q: "What does the arrow sticker on a wire module mean?", image: { src: "images/faq-arrows-wire.jpg", alt: "A Flat wire module with its red arrow sticker circled, in the middle of the three lines.", caption: "The arrow sticker on a wire module, circled." }, a: "Each wire module has a red arrow sticker that shows which way the signal runs through that piece. Besides the magnets, it reminds you of the order of the circuit: the signal starts at the power module and flows along the arrows, so place each electronic module after the one that feeds it. The magnets at the two ends of a wire module have opposite poles, set to match the signal direction from input to output. This is also the main difference between Flap-in and Flap-out. Keep every sticker pointing the same way and line it up with the arrows on the electronic modules: the magnets then attract, and each electronic module only clicks on the right way round. The Cross shape has two stickers, because it turns the circuit or splits it into two directions.", source: "SkinKit paper, section 3.4 and Fig. 7", confirm: false },
    { q: "What do the arrows on the electronic modules mean?", image: { src: "images/faq-arrows-module.jpg", alt: "An LED module with its two printed white arrows circled, one on the left edge and one on the right.", caption: "The two printed arrows on an electronic module, circled." }, a: "Each electronic module has two arrows printed on its front, one on each side. They show which way the signal goes: in on the side the arrows come from, out on the side they point to. Every module also has its three lines in the same place: power (+) along the top, the signal through the middle and ground (−) along the bottom. When every arrow points the same way, power meets power and ground meets ground at each joint, and each output meets the next module's input. Turn a module around and its + lands on the ground line and its output faces backwards, so the circuit stops working. The magnets help: the two rows have opposite poles, so a module only clicks on the right way round.", demo: "arrows", source: "SkinKit paper, section 3.2, Fig. 3 and section 3.3.2", confirm: false },
    { q: "How do I take it off? Does it hurt?", a: "Don't stick it on hairy parts of the body, or taking it off will hurt. To take it off, peel it slowly from one corner while holding the skin flat, the way you take off a bandage.", confirm: false },
    { q: "Can it get wet? What about sweat?", a: "No. Keep it away from water: like any electronic circuit, the modules can't get wet. Sweat is fine, though. SkinKit is made to handle it.", confirm: false },
    { q: "Can I use it on sensitive skin?", a: "We don't recommend it. If you do, stick it on with medical-grade double-sided tape (Vapon), and take it off if your skin itches or turns red.", confirm: false },
    { q: "Can I reuse the modules and wire modules?", a: "The electronic modules, yes: unsnap them and use them again in your next project. The wire modules depend on how you used them. While you are only laying them out and trying them on, you can rearrange and reuse them. Once you have peeled off the tape backing and stuck them on your skin, they can't be reused.", confirm: false },
    { q: "What battery does it use, and how long does it last?", a: "Pick the battery by its voltage. Different sensors need different voltages, but 2 to 4 V generally works. We use a 3.7 V battery, which goes in the main power module. How long it lasts depends on the battery and on which modules you run.", confirm: false },
    { q: "I connected everything but nothing lights up. What now?", a: "Work through these three checks, in order.", steps: [
      "Check the wire modules. If a magnet is on the wrong way, the current can't get through. Strip the circuit down to the simplest one, a power module and one output such as an LED. If that works, add the other electronic modules back one at a time until you find the problem.",
      "Check that each electronic module is connected the right way: its arrows point the same way as the rest, and its magnets are clicked on firmly.",
      "If everything is connected right, the electronic module itself may be broken. Try another one of the same kind."
    ], confirm: false },
    { q: "Where can I get a SkinKit?", a: "SkinKit is not for sale right now. Kits are used in Hybrid Body Lab workshops and courses.", confirm: false }
  ],

  citation: {
    text: "Pin-Sung Ku, Md. Tahmidul Islam Molla, Kunpeng Huang, Priya Kattappurath, Krithik Ranjan, Hsin-Liu (Cindy) Kao. SkinKit: Construction Kit for On-Skin Interface Prototyping. Proc. ACM IMWUT 5(4), Article 165, December 2021.",
    doi: "https://doi.org/10.1145/3494989",
    funding: "Supported by NSF grant IIS #2047249.",
    project: "https://www.hybridbody.human.cornell.edu/skinkit"
  }
};
