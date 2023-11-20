<script lang="ts">
    import * as converter from "$lib/convert.js";
    import * as Render from "$lib/render.js";

    //let initial = converter.new_structure("2,3-methyloctan");

    interface Structure {
        element: string;
        sides: Structure[][];
    }

    interface ElementPart {
        x: number;
        y: number;
        e: string;
        n: number;
    }
    interface Line {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }

    let structure: Structure[] = [
        {
            element: "CH3",
            sides: [],
        },
        {
            element: "CH2",
            sides: [],
        },
        {
            element: "C",
            sides: [
                [
                    {
                        element: "CH2",
                        sides: [],
                    },
                    {
                        element: "CH3",
                        sides: [],
                    },
                ],
                [
                    {
                        element: "CH3",
                        sides: [],
                    },
                ],
            ],
        },
        {
            element: "CH2",
            sides: [],
        },
        {
            element: "CH2",
            sides: [],
        },
        {
            element: "OH",
            sides: [],
        },
    ];

    let alk = "4,4-Ethyl-5-Propylnonanol";

    //initial = converter.new_structure("2,2-ethyloctan");

    let render_array: ElementPart[] = []; // = render_math.calculate(initial, 250, 250, 0, 50);
    let render_line_array: Line[] = []; //render_math.calculate_lines(render_array, 50);
    let max_x = 500;
    let max_y = 100;

    const convert = () => {
        structure = converter.new_structure(alk);
        let out = Render.render(structure);
        render_array = out.render_array;
        render_line_array = out.render_line_array;
        max_x = out.max_x;
        max_y = out.max_y;
    };

    convert();
</script>

<main>
    <input class="input-style" role="button" type="text" bind:value={alk} />
    <button class="input-style" type="button" on:click={convert}>Render</button>
</main>

<svg
    class="canvas"
    height={max_y}
    width={max_x}
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
>
    {#each render_array as item}
        <text
            fill="#242424"
            font-size="15"
            font-family="Verdana"
            y={item.y}
            x={item.x}
            >{item.e}{#if item.n != 1 && item.n != 0}
                <tspan font-size="11" baseline-shift="sub">{item.n}</tspan>
            {/if}
        </text>
    {/each}
    {#each render_line_array as item}
        <line
            x1={item.x1}
            y1={item.y1}
            x2={item.x2}
            y2={item.y2}
            style="stroke:rgb(0,0,0);stroke-width:1"
        />
    {/each}
</svg>

<style>
    main {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .canvas {
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translate(-50%, 0%);
    }
    * {
        cursor: default;
    }
    .input-style {
        --b: 3px; /* border thickness */
        --s: 0.45em; /* size of the corner */
        --color: #373b44;

        padding: calc(0.5em + var(--s)) calc(0.9em + var(--s));
        color: var(--color);
        --_p: var(--s);
        background: conic-gradient(
                from 90deg at var(--b) var(--b),
                #0000 90deg,
                var(--color) 0
            )
            var(--_p) var(--_p) / calc(100% - var(--b) - 2 * var(--_p))
            calc(100% - var(--b) - 2 * var(--_p));
        transition: 0.3s linear, color 0s, background-color 0s;
        outline: var(--b) solid #0000;
        outline-offset: 0.6em;
        font-size: 16px;

        border: 0;

        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    .input-style:hover,
    .input-style:focus-visible {
        --_p: 0px;
        outline-color: var(--color);
        outline-offset: 0.05em;
    }

    button:active {
        background: var(--color);
        color: #fff;
    }
</style>
