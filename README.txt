SkinKit tutorial page (Hybrid Body Lab)

Open index.html in any browser. No install or build step.

Structure
  Part 1  What is SkinKit: headline, animated module strip, how it works, "Try a circuit"
          playground, overview video, what people have made, guide to all modules.
  Part 2  Make & use: the visitor picks a path, then goes step by step.
            "Make it yourself"  make the skin cloth and the wire modules
            "I have a SkinKit"  build a circuit, shape it and wear it
          Words to know, skin safety and FAQ sit at the bottom of Part 2.

Files
  index.html   page structure
  style.css    styles matching the lab site (futura-pt / proxima-nova, greys, square corners).
               Every rule is scoped under #sk-root and every class starts with "sk-",
               so it will not affect the rest of a host site. Standalone, Jost and
               Montserrat (Google Fonts) stand in for the lab's Adobe fonts.
  script.js    switching parts, the playground, back/next, arrow keys, "I did this step"
  content.js   ALL text, steps, modules and links. Edit this file to change content.
               "TODO" marks facts still to confirm with the lab. In the FAQ, an answer
               with confirm: true shows a "To confirm" tag; set it to false once checked.
  images/      step clips (.mp4, short, muted, looping) and photos

Adding media
  Each step in content.js has a shot ID (e.g. "1-03") matching the shot list.
  Export the clip as images/1-03.mp4 and set   media: { video: "images/1-03.mp4" }
  Photos work the same way:                     media: { image: "images/1-03.jpg" }
  Workshop projects: add  image: "images/fig10c.jpg"  to an entry in applications.
  Overview video: paste the YouTube link into overviewVideo.youtube.

Links into the page
  index.html#about      Part 1
  index.html#try        the "Try a circuit" playground
  index.html#tutorial   Part 2, choose a path
  index.html#faq        the FAQ
  index.html#make-1     step 1 of "Make it yourself"
  index.html#use-5      step 5 of "I have a SkinKit"

Putting it on the lab site
  Option A: host this folder (e.g. GitHub Pages) and link to it from the lab site.
  Option B: Squarespace Code Block. Paste the contents of <div id="sk-root"> plus the
            <link> and <script> tags, with style.css / content.js / script.js hosted as files.
            If the lab site already uses "#" in its own addresses (like /#/skinkit/), add
              <script>window.SKINKIT_USE_HASH = false;</script>
            before script.js. The page then switches parts without changing the address.
