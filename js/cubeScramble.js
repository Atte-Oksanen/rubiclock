export function scrambleCube(scramble) {
    let cube = [
        [
            [0, 0, 0], [0, 0, 0], [0, 0, 0]
        ],
        [
            [1, 1, 1], [1, 1, 1], [1, 1, 1]
        ],
        [
            [2, 2, 2], [2, 2, 2], [2, 2, 2]
        ],
        [
            [3, 3, 3], [3, 3, 3], [3, 3, 3]
        ],
        [
            [4, 4, 4], [4, 4, 4], [4, 4, 4]
        ],
        [
            [5, 5, 5], [5, 5, 5], [5, 5, 5]
        ],
    ];


    for (let n = 0; n < scramble.length; n++) {
        const directionSelected = scramble[n].charAt(1);
        switch (scramble[n].charAt(0)) {
            case 'L':
                if (directionSelected == "'") {
                    cube = turnRight(cube, 0);
                    cube = rotateCounterClockWise(cube, 1);

                } else if (directionSelected == '2') {
                    cube = turnLeft(cube, 0);
                    cube = turnLeft(cube, 0);
                    cube = rotateHalf(cube, 1);

                } else {
                    cube = turnLeft(cube, 0);
                    cube = rotateClockWise(cube, 1);

                }
                break;

            case 'R':
                if (directionSelected == "'") {
                    cube = turnLeft(cube, 2);
                    cube = rotateCounterClockWise(cube, 3);

                } else if (directionSelected == '2') {
                    cube = turnRight(cube, 2);
                    cube = turnRight(cube, 2);
                    cube = rotateHalf(cube, 3);
                } else {
                    cube = turnRight(cube, 2);
                    cube = rotateClockWise(cube, 3);

                }
                break;

            case 'F':
                if (directionSelected == "'") {
                    cube = turnBack(cube, 2);
                    cube = rotateCounterClockWise(cube, 2);

                } else if (directionSelected == '2') {
                    cube = turnFace(cube, 2);
                    cube = turnFace(cube, 2);
                    cube = rotateHalf(cube, 2);
                } else {
                    cube = turnFace(cube, 2);
                    cube = rotateClockWise(cube, 2);
                }
                break;

            case 'B':
                if (directionSelected == "'") {
                    cube = turnFace(cube, 0);
                    cube = rotateCounterClockWise(cube, 4);

                } else if (directionSelected == '2') {
                    cube = turnBack(cube, 0);
                    cube = turnBack(cube, 0);
                    cube = rotateHalf(cube, 4);
                } else {
                    cube = turnBack(cube, 0);
                    cube = rotateClockWise(cube, 4);
                }
                break;

            case 'U':
                if (directionSelected == "'") {
                    cube = turnDown(cube, 0);
                    cube = rotateCounterClockWise(cube, 0);

                } else if (directionSelected == '2') {
                    cube = turnUp(cube, 0);
                    cube = turnUp(cube, 0);
                    cube = rotateHalf(cube, 0);
                } else {
                    cube = turnUp(cube, 0);
                    cube = rotateClockWise(cube, 0);

                }
                break;

            case 'D':
                if (directionSelected == "'") {
                    cube = turnUp(cube, 2);
                    cube = rotateCounterClockWise(cube, 5);

                } else if (directionSelected == '2') {
                    cube = turnDown(cube, 2);
                    cube = turnDown(cube, 2);
                    cube = rotateHalf(cube, 5);
                } else {
                    cube = turnDown(cube, 2);
                    cube = rotateClockWise(cube, 5);

                }
                break;
        }
    }
    return cube;
}

/*
 * For moves U (0) and D' (2)
 */
function turnUp(cube, layer) {
    let first = [];   

    for (let n = 0; n < 3; n++) {
        first[n] = cube[1][layer][n];
    }

    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            cube[i][layer][j] = cube[i + 1][layer][j];
        }
    }

    for (let i = 0; i < 3; i++) {
        cube[4][layer][i] = first[i];
    }
    return cube;
}


/*
 * For moves D (2) and U' (0)
 */
function turnDown(cube, layer) {
    const first = [];

    for (let n = 0; n < 3; n++) {
        first[n] = cube[4][layer][n];
    }

    for (let i = 4; i > 1; i--) {
        for (let j = 0; j < 3; j++) {
            cube[i][layer][j] = cube[i - 1][layer][j];
        }
    }

    for (let i = 0; i < 3; i++) {
        cube[1][layer][i] = first[i];
    }

    return cube;
}


/*
 * For moves R (2) and L' (0)
 */
function turnRight(cube, layer) {    
    for (let i = 0; i < 3; i++) {
        let first = cube[2][i][layer];
        cube[2][i][layer] = cube[5][i][layer];
        cube[5][i][layer] = cube[4][2 - i][2 - layer];
        cube[4][2 - i][2 - layer] = cube[0][i][layer];
        cube[0][i][layer] = first;
    }
    return cube;
}

/*
 * For moves L (0)  and R' (2)
 */
function turnLeft(cube, layer) {
    for (let i = 0; i < 3; i++) {
        let first = cube[2][i][layer];
        cube[2][i][layer] = cube[0][i][layer];
        cube[0][i][layer] = cube[4][2 - i][2 - layer];
        cube[4][2 - i][2 - layer] = cube[5][i][layer];
        cube[5][i][layer] = first;
    }
    return cube;
}


/*
 * For moves F (2) and B' (0)
 */
function turnFace(cube, layer) {
    for (let i = 0; i < 3; i++) {
        let first = cube[0][layer][i];
        cube[0][layer][i] = cube[1][2 - i][layer];
        cube[1][2 - i][layer] = cube[5][2 - layer][2 - i];
        cube[5][2 - layer][2 - i] = cube[3][i][2 - layer];
        cube[3][i][2 - layer] = first;
    }
    return cube;
}

/*
 * For moves B (0) and F' (2)
 */
function turnBack(cube, layer) {
    for (let i = 0; i < 3; i++) {
        let first = cube[0][layer][i];
        cube[0][layer][i] = cube[3][i][2 - layer];
        cube[3][i][2 - layer] = cube[5][2 - layer][2 - i];
        cube[5][2 - layer][2 - i] = cube[1][2 - i][layer];
        cube[1][2 - i][layer] = first;
    }
    return cube;
}

/*
 * Functions to rotate a face
 */

function rotateClockWise(cube, side) {

    const temp = [[], [], []];
    for (let n = 0; n < 3; n++) {
        for (let j = 0; j < 3; j++) {
            temp[n][j] = cube[side][n][j];
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            cube[side][i][j] = temp[2 - j][i];
        }
    }
    return cube;
}

function rotateCounterClockWise(cube, side) {
    cube = rotateClockWise(cube, side);
    cube = rotateClockWise(cube, side);
    cube = rotateClockWise(cube, side);

    return cube;
}

function rotateHalf(cube, side) {
    cube = rotateClockWise(cube, side);
    cube = rotateClockWise(cube, side);

    return cube;
}