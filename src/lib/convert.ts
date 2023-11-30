const ALKANE = ["meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec", "undec", "dodec"];
const ENDS = ["an", "yl", "ol", "anol", "ene"];

interface Structure {
    element: string;
    sides: Structure[][];
}

interface PreStructure {
    element: string;
    num: number
    sides: Structure[][];
}

const split = (name: string) => {
    let parts = name.split("-");
    let stage1: any[] = [];
    let temp: any[] = [];
    let error = 0;
    parts.forEach(element => {
        error = 0;
        while (element.length != 0 && error < 50) {
            error += 1;
            let nums = extract_numbers(element);
            if (nums.length > 0) {
                temp = nums;
                element = ""
            }
            let end = get_ending(element, ENDS);
            if (end.length > 0) {
                temp.push(end[0]);
                element = end[1];
            }
            let begin = get_ending(element, ALKANE);
            if (begin.length > 0) {
                temp.push(begin[0]);
                element = begin[1];
            }
        }
        stage1.push(temp);
        temp = [];
    })
    return stage1;
}

const extract_numbers = (str: string) => {
    let seps: string[] = [];
    let output: number[] = [];
    seps = str.split(",");
    seps.forEach(maybe_num => {
        if (!isNaN(Number(maybe_num))) {
            output.push(Number(maybe_num))
        }
    });
    return output;
}

const join = (split_array: any[][]) => {

    let array: any[] = [];
    let temp: any[] = [];
    let last = [];
    for (let i = 0; i < split_array.length; i++) {
        let part = split_array[i].reverse();
        if (i % 2 == 0) {
            temp.push(part);
        } else {
            while (part.length > 2) {
                last.push(part.pop());
            }
            temp.push(part);
        }
        array.push(part)
    }
    array[array.length - 1] = array[array.length - 1].concat(last);
    if (array.at(-1).length == 3) array[array.length - 1].reverse();
    if (array.at(-1).at(-1) == "ol" && array.at(-1).at(-2) == "an") {
        array[array.length - 1].pop();
        array[array.length - 1].pop();
        array[array.length - 1].push("anol");
    }
    return array;
}

const merge_ends = (array: any[][]) => {
    let next = [];
    let last = [];
    for (let i = 0; i < array.length; i += 2) {
        if (i >= array.length) break;
        if (array.length == 1) {
            next.push([array[i], [0]])
        } else {
            let element = array[i + 1];
            if (element.length > 2) {
                last.push(element.pop());
                last.push(element.pop());
            }
            next.push([element, array[i]]);

        }
    }
    if (last.length) {
        next.push([last, [0]])
    }
    return next;
}

const get_ending = (last: string, array: string[]) => {
    let end: string = "";
    [...array].sort((a, b) => a.length - b.length).forEach(ending => {
        if (ends_with(last, ending)) {
            end = ending;
        }
    });
    if (end.length > 0) {
        let trimed = last.slice(0, - (end.length));
        return [end, trimed];
    }
    return [];
}

const ends_with = (str: string, substr: string) => {
    return str.slice(- substr.length) == substr;
}

const build_base = (base: any[][]) => {
    let alk = base[0][0];
    let alk_length = ALKANE.findIndex((element) => element == alk) + 1;
    let structure: PreStructure[] = [];

    for (let i = 0; i < alk_length; i++) {
        let element = { element: "CH", num: 2, sides: [] };
        if (i == 0) {
            element.num += 1;
        }
        structure.push(element);
    }

    switch (base[0][1]) {
        case "an":
            // @ts-ignore: Object is possibly 'undefined'.
            structure.at(-1).num += 1;
            break;
        case "anol":
            // @ts-ignore: Object is possibly 'undefined'.
            structure.at(-1).num += 1;
            // @ts-ignore: Object is possibly 'undefined'.
            structure.at(0).num -= 1;
            structure.unshift({ element: "HO", num: 1, sides: [] });
            break;

    }
    return [structure, base[0][1]];
}

const build = (arrays: any[][][]) => {
    if (arrays.length < 1) return [];
    let base = build_base(arrays[arrays.length - 1]);
    for (let index = 0; index < arrays.length - 1; index++) {
        const element = arrays[index];
        let arm: PreStructure[] = [];
        for (let i = 0; i < ALKANE.findIndex((s) => s == element[0][0]) + 1; i++) {
            arm.push({ element: "CH", num: 2, sides: [] });
        }
        arm[arm.length - 1].num += 1;
        element[1].forEach(part => {
            base[0][part - 1].sides.push(arm);
        });
    }
    return base[0];
}

//make recursive for all
const to_render = (prestructure: PreStructure[]) => {
    let structure: Structure[] = [];
    prestructure.forEach(preelement => {
        let element = "";
        if (preelement.num == 1) {
            element = preelement.element;
        } else if (preelement.num <= 0) {
            element = preelement.element.slice(0, -1)
        } else {
            element = preelement.element + preelement.num;
        }
        let sides: Structure[] = [];
        preelement.sides.forEach(sid => {
            sides.push(to_render(sid));
        });
        structure.push({ element: element, sides: sides });
    })
    return structure;
}

export const new_structure = (name: string) => {
    return to_render(build(merge_ends(join(split(name.toLowerCase())))));
};
