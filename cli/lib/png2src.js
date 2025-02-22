const fs = require("fs");
const path = require("path");
const pngjs = require("pngjs");
const mustache = require("mustache");

const LANGS={
    as: "assemblyscript",
    assemblyscript: "assemblyscript",
    c: "c",
    d: "d",
    go: "go",
    nim: "nim",
    odin: "odin",
    rs: "rust",
    rust: "rust",
    zig: "zig",
}
const DEFAULT_LANG = 'assemblyscript';
const TEMPLATES = {
    assemblyscript:
`{{#sprites}}
// {{name}}
const {{name}}Width = {{width}};
const {{name}}Height = {{height}};
const {{name}}Flags = {{flags}}; // {{flagsHumanReadable}}
const {{name}} = memory.data<u8>([ {{bytes}} ]);

{{/sprites}}`,

    c:
`{{#sprites}}
// {{name}}
#define {{name}}Width {{width}}
#define {{name}}Height {{height}}
#define {{name}}Flags {{flagsHumanReadable}}
const uint8_t {{name}}[{{length}}] = { {{bytes}} };

{{/sprites}}`,

    d:
`
{{#sprites}}
// {{name}}
enum {{name}}Width = {{width}};
enum {{name}}Height = {{height}};
enum {{name}}Flags = {{flag}}; // {{flagsHumanReadable}}
immutable ubyte[] {{name}} = [ {{bytes}} ];

{{/sprites}}`,

    go:
`{{#sprites}}
// {{name}}
const {{name}}Width = {{width}}
const {{name}}Height = {{height}}
const {{name}}Flags = {{flags}} // {{flagsHumanReadable}}
var {{name}} = [{{length}}]byte { {{bytes}} }

{{/sprites}}`,

    nim:
`{{#sprites}}
# {{name}}
const {{name}}Width = {{width}}
const {{name}}Height = {{height}}
const {{name}}Flags = {{flagsHumanReadable}}
var {{name}}: array[uint8, {{length}}] = [{{firstByte}}'u8,{{restBytes}}]

{{/sprites}}`,

    odin: 
`{{#sprites}}
// {{name}}
{{odinName}}_width : u32 : {{width}}
{{odinName}}_height : u32 : {{height}}
{{odinName}}_flags : w4.Blit_Flags : {{odinFlags}} // {{flagsHumanReadable}}
{{odinName}} := [{{length}}]u8{ {{bytes}} }

{{/sprites}}`,

    rust: 
`{{#sprites}}
// {{name}}
const {{rustName}}_WIDTH: u32 = {{width}};
const {{rustName}}_HEIGHT: u32 = {{height}};
const {{rustName}}_FLAGS: u32 = {{flags}}; // {{flagsHumanReadable}}
const {{rustName}}: [u8; {{length}}] = [ {{bytes}} ];

{{/sprites}}`,

    zig:
`{{#sprites}}
// {{name}}
const {{name}}Width = {{width}};
const {{name}}Height = {{height}};
const {{name}}Flags = {{flags}}; // {{flagsHumanReadable}}
const {{name}} = [{{length}}]u8{ {{bytes}} };

{{/sprites}}`,
}

function run (sourceFile) {
    const png = pngjs.PNG.sync.read(fs.readFileSync(sourceFile), {
        colorType: 1,
        inputColorType: 1,
    });

    if (!png.palette) {
        throw new Error("Does not have indexed color palette");
    }

    // Map rgba to palette index
    const palette = new Map();
    for (let ii = 0; ii < png.palette.length; ++ii) {
        const rgba = png.palette[ii];
        const packed = (rgba[0] << 24) | (rgba[1] << 16) | (rgba[2] << 8) | rgba[3];
        palette.set(packed, ii);
    }

    let flags, flagsHumanReadable, odinFlags;
    let bpp;
    if (palette.size <= 2) {
        bpp = 1;
        flags = 0;
        flagsHumanReadable = "BLIT_1BPP";
        odinFlags = "nil"
    } else if (palette.size <= 4) {
        bpp = 2;
        flags = 1;
        flagsHumanReadable = "BLIT_2BPP";
        odinFlags = "{ .USE_2BPP }"
    } else {
        throw new Error("Palette is larger than 4 colors");
    }

    const factor = 8 / bpp;
    if (png.width % factor != 0) {
        throw new Error(`${bpp}BPP sprites must have a width divisible by ${factor}`);
    }

    const bytes = new Uint8Array(png.width*png.height*bpp/8);

    // Read a color (palette index) from the source png
    function readColor (x, y) {
        const idx = 4*(png.width*y + x);
        const r = png.data[idx];
        const g = png.data[idx+1];
        const b = png.data[idx+2];
        const a = png.data[idx+3];
        const packed = (r << 24) | (g << 16) | (b << 8) | a;
        return palette.get(packed);
    }

    // Write a color (palette index) to the output buffer
    function writeColor (color, x, y) {
        let idx, shift, mask;
        switch (bpp) {
        case 1:
            idx = (y*png.width + x) >> 3;
            shift = 7 - (x & 0x07);
            mask = 0x1 << shift;
            break;

        case 2:
            idx = (y*png.width + x) >> 2;
            shift = 6 - ((x & 0x3) << 1);
            mask = 0x3 << shift;
            break;

        default:
            throw new Error("assert");
        }

        bytes[idx] = (color << shift) | (bytes[idx] & (~mask));
    }

    for (let y = 0; y < png.height; ++y) {
        for (let x = 0; x < png.width; ++x) {
            const color = readColor(x, y);
            writeColor(color, x, y);
        }
    }

    const varName = path
        .basename(sourceFile, ".png")
        .replace(/[^0-9A-Za-z]+/g, "_")
        .replace(/^([0-9])/, "_$1");

    const rustVarName = (varName.substr(0,1) + varName.substr(1)
        .replace(/[A-Z]/g, l => '_' + l))
        .toLocaleUpperCase()

    const dataBytes = [...bytes]
            .map((b) => "0x" + b.toString(16).padStart(2, "0"))
    
    const data = dataBytes.join(',')

    const odinVarName = (varName.substr(0,1) + varName.substr(1)
        .replace(/[A-Z]/g, l => '_' + l))
        .toLocaleLowerCase()

    return {
        "name": varName,
        "height": png.height,
        "width": png.width,
        "length": bytes.length,
        "flags": flags,
        "flagsHumanReadable": flagsHumanReadable,
        "bytes": data,
        "firstByte": dataBytes[0],
        "restBytes": dataBytes.slice(1).join(','),
        "rustName": rustVarName,
        "odinName": odinVarName,
        "odinFlags": odinFlags,
    };
}

exports.run = run;

function runAll (files, opts) {
    let template = TEMPLATES[LANGS[opts.lang]];

    if (!opts.template) {
        // iterate over all options and search a key that presented in templates
        for(let key in opts) {
            if (key in TEMPLATES) {
                template = TEMPLATES[key]
                break;
            }
        }

    } else {
        template = fs.readFileSync(opts.template, {encoding: 'utf8'});
    }
    
    let output = { "sprites": [] };
    for (let ii = 0; ii < files.length; ++ii) {
        const file = files[ii];

        try {
            if (ii > 0) {
                console.log();
            }

            output.sprites.push(run(file));
        } catch (error) {
            console.error("Error processing "+file+": "+error.message);
            break;
        }
    }

    const parsed = mustache.render(template, output);
    if (opts.output == "-") {
        console.log(parsed);
    } else {
        fs.writeFileSync(opts.output, parsed);
    }
}

exports.runAll = runAll;
