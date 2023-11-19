
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

export const render = (array: Structure[]) => {
    let render_array: ElementPart[] = []; // = render_math.calculate(initial, 250, 250, 0, 50);
    let render_line_array: Line[] = []; //render_math.calculate_lines(render_array, 50);
    const pos: number[] = [50, 250];
    let max_x = 0;
    const space = 50;

    const create_render = (
        pos: number[],
        index: number,
        array: Structure[],
        horizontal: boolean
    ) => {
        let current = array[index];
        let new_pos: number[];
        let new_side_pos_p: number[];
        let new_side_pos_m: number[];

        if (horizontal) {
            new_pos = [pos[0] + space, pos[1]];
            new_side_pos_p = [pos[0], pos[1] + space];
            new_side_pos_m = [pos[0], pos[1] - space];
        } else {
            new_pos = [pos[0], pos[1] + space];
            new_side_pos_p = [pos[0] + space, pos[1]];
            new_side_pos_m = [pos[0], pos[1] - space];
        }

        if (new_pos[0] > max_x) {
            max_x = new_pos[0];
        }
        if (new_side_pos_p[0] > max_x) {
            max_x = new_side_pos_p[0];
        }
        if (new_side_pos_m[0] > max_x) {
            max_x = new_side_pos_m[0];
        }

        let e = current.element;
        //console.log(e);
        let n = e.slice(-1);
        if (isNaN(Number(n))) {
            //console.log(n);
            n = "";
        } else {
            e = e.slice(0, -1);
        }
        if (horizontal) {
            new_pos[0] += (e.length - 1) * 10;
        }

        render_array.push({ x: pos[0], y: pos[1], e: e, n: Number(n) });
        if (index != array.length - 1) {
            create_render(new_pos, index + 1, array, horizontal);
            add_line(pos, new_pos, horizontal, e.length);
        }
        for (let i = 0; i < current.sides.length; i++) {
            const element = current.sides[i];
            if (i == 0) {
                add_line(
                    pos,
                    new_side_pos_p,
                    !horizontal,
                    current.element.length
                );
                create_render(new_side_pos_p, 0, element, !horizontal);
            } else {
                add_line(
                    new_side_pos_m,
                    pos,
                    !horizontal,
                    current.element.length
                );
                create_render(new_side_pos_m, 0, element, !horizontal);
            }
        }
    };

    const add_line = (
        pos_1: number[],
        pos_2: number[],
        horizontal: boolean,
        char_len: number
    ) => {
        if (horizontal) {
            render_line_array.push({
                x1: pos_1[0] + 10 * char_len + 2,
                y1: pos_1[1] - 5,
                x2: pos_2[0] - 1,
                y2: pos_2[1] - 5,
            });
        } else {
            render_line_array.push({
                x1: pos_1[0] + 5,
                y1: pos_1[1] + 1,
                x2: pos_2[0] + 5,
                y2: pos_2[1] - 12,
            });
        }
    };
    create_render(pos, 0, array, true);
    max_x += pos[0];

    return {
        render_array: render_array,
        render_line_array: render_line_array,
        max_x: max_x,
    };
}
