import MultiLanguage, {Page} from '@site/src/components/MultiLanguage';

# Setup

Download WASM-4:

<p>
<a href="https://github.com/aduros/wasm4/releases/latest/download/w4-windows.zip" className="button button--primary button--outline button--lg margin--md">📥 Windows</a>
<a href="https://github.com/aduros/wasm4/releases/latest/download/w4-mac.zip" className="button button--primary button--outline button--lg margin--md">📥 macOS</a>
<a href="https://github.com/aduros/wasm4/releases/latest/download/w4-linux.zip" className="button button--primary button--outline button--lg margin--md">📥 Linux</a>
</p>

<Button/>

This contains the `w4` command that will be used to create new projects and run games locally.

:::info
You can also install `w4` with NPM by running `npm install -g wasm4`
:::

## Quickstart

Let's go over creating a new project called `hello-world` for your chosen language. Use the dropdown
menu to select a different language.

<MultiLanguage>

<Page value="assemblyscript">

To compile AssemblyScript projects you will need `npm` installed.

```shell
w4 new --assemblyscript hello-world
cd hello-world
```

First we'll setup AssemblyScript (this only needs to be done once):

```shell
npm install
```

Compile the .wasm cartridge:

```shell
npm run build
```

Run it in WASM-4 with:

```shell
w4 run build/cart.wasm
```

</Page>

<Page value="c">

To compile C/C++ projects you will need to download the [WASI SDK](https://github.com/WebAssembly/wasi-sdk) and set the `$WASI_SDK_PATH` environment variable.

```shell
w4 new --c hello-world
cd hello-world
```

Compile the .wasm cartridge:

```shell
make
```

Run it in WASM-4 with:

```shell
w4 run build/cart.wasm
```

</Page>

<Page value="d">

To compile D projects you will need `ldc` installed. To use libc, you also need to download the [WASI SDK](https://github.com/WebAssembly/wasi-sdk) and set the `$WASI_SDK_PATH` environment variable.

```shell
w4 new --d hello-world
cd hello-world
```

Compile the .wasm cartridge:

```shell
make
```

Run it in WASM-4 with:

```shell
w4 run cart.wasm
```

</Page>

<Page value="go">

To compile Go projects you will need `go` and `tinygo` installed.

```shell
w4 new --go hello-world
cd hello-world
```

Compile the .wasm cartridge:

```shell
make
```

Run it in WASM-4 with:

```shell
w4 run build/cart.wasm
```

</Page>

<Page value="nim">

To compile Nim projects you will need `nimble` installed. You will also need to download the [WASI SDK](https://github.com/WebAssembly/wasi-sdk) and set the `$WASI_SDK_PATH` environment variable.

```shell
w4 new --nim hello-world
cd hello-world
```

Compile the .wasm cartridge:

```shell
nimble rel
```

Run it in WASM-4 with:

```shell
w4 run build/cart.wasm
```

</Page>

<Page value="odin">

To compile Odin projects you will need to download the [WASI SDK](https://github.com/WebAssembly/wasi-sdk) and set the `$WASI_SDK_PATH` environment variable. You'll also need the latest version of [Odin](https://https://github.com/odin-lang/Odin).

```shell
w4 new --odin hello-world
cd hello-world
```

Compile the .wasm cartridge:

```shell
make
```

Run it in WASM-4 with:

```shell
w4 run build/cart.wasm
```

</Page>

<Page value="rust">

To compile Rust projects you will need `cargo` installed. You will also need the wasm32 target,
which can be installed with `rustup target add wasm32-unknown-unknown`.

```shell
w4 new --rust hello-world
cd hello-world
```

Compile the .wasm cartridge:

```shell
cargo build --release
```

Run it in WASM-4 with:

```shell
w4 run target/wasm32-unknown-unknown/release/cart.wasm
```

</Page>

<Page value="zig">

To compile Zig projects you will need a recent build of `zig` installed.

```shell
w4 new --zig hello-world
cd hello-world
```

Compile the .wasm cartridge:

```shell
zig build -Drelease-small=true
```

Run it in WASM-4 with:

```shell
w4 run zig-out/lib/cart.wasm
```

</Page>

</MultiLanguage>

:::tip
You can also use `w4 watch` to automatically watch for changes in source files and rebuild in real-time.
:::

## Next Steps

Next let's take a look at some source code for [Hello World](/docs/getting-started/hello-world).
