
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

interface Output {
    render_array: ElementPart[],
    render_line_array: Line[],
    max_x: number,
}

enum WDir {
    L,
    R,
    U,
    D,
}

export const render = (array: Structure[]) => {
    let render_array: ElementPart[] = []; // = render_math.calculate(initial, 250, 250, 0, 50);
    let render_line_array: Line[] = []; //render_math.calculate_lines(render_array, 50);
    const pos: number[] = [100, 150];
    let max_x = 0;
    let max_y = 0;
    const space = 50;

    const horz_line = (e: string, n: number, pos: number[][]) => {
        render_array.push({ e: e, n: n, x: pos[1][0], y: pos[1][1], })
        if (pos[0][0] > pos[1][0]) {
            let t = pos[0];
            pos[0] = pos[1];
            pos[1] = t;
        }
        if (pos[1][0] > max_x) {
            max_x = pos[1][0];
        }
        render_line_array.push({ x1: pos[0][0] + (e.length * 10), y1: pos[0][1] - 5, x2: pos[1][0], y2: pos[1][1] - 5 });
    }

    const vert_line = (e: string, n: number, pos: number[][]) => {
        render_array.push({ e: e, n: n, x: pos[1][0], y: pos[1][1], })
        if (pos[0][1] > pos[1][1]) {
            let t = pos[0];
            pos[0] = pos[1];
            pos[1] = t;
        }
        if (pos[1][1] > max_y) {
            max_y = pos[1][1];
        }
        render_line_array.push({ x1: pos[0][0] + 5, y1: pos[0][1] + 1, x2: pos[1][0] + 5, y2: pos[1][1] - 11 });
    }

    const create_render = (pos: number[], index: number, array: Structure[], dir: WDir) => {
        if (index == array.length) return;
        let current = array[index];

        let e = current.element;
        let n = e.slice(-1);
        if (isNaN(Number(n))) {
            n = "1";
        } else {
            e = e.slice(0, -1);
        }

        let next_pos: number[] = [...pos];
        if (dir == WDir.L) {
            next_pos[0] += space;
        } else if (dir == WDir.R) {
            next_pos[0] -= space;
        } else if (dir == WDir.D) {
            next_pos[1] += space;
        } else if (dir == WDir.U) {
            next_pos[1] -= space;
        }

        let mn = 0;
        for (let i = 0; i < current.sides.length; i++) {
            const element = current.sides[i];
            let d = WDir.D;
            if (i) d = WDir.U;
            create_render(next_pos, 0, element, d);
            mn -= 1;
        }
        if (dir == WDir.L || dir == WDir.R) {
            horz_line(e, Number(n) + mn, [pos, next_pos])
        } else if (dir == WDir.D || dir == WDir.U) {
            vert_line(e, Number(n) + mn, [pos, next_pos])
        }
        create_render(next_pos, index + 1, array, dir);
    }

    create_render(pos, 0, array, WDir.L);
    render_line_array.shift();
    max_x += pos[0];
    max_y += pos[1];


    return {
        render_array: render_array,
        render_line_array: render_line_array,
        max_x: max_x,
        max_y: max_y,
    };
}
