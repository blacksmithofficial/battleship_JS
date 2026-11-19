/* BATTLESHIP  */

// [ DOM ] : Elements
const start_menu = document.getElementById('start_menu');
const player_start = document.getElementById('player_start');
const player_input = document.getElementById('player_input');
const player_setup = document.getElementById('player_setup');
const player_name = document.getElementById('player_name');
const player_grid = document.getElementById('player_grid');
const ship_display = document.getElementById('ship_display');
const setup_grid = document.getElementById('setup_grid');
const grid_indicator = document.getElementById('grid_indicator');
const war_grid = document.getElementById('war_grid');
const start_button = document.getElementById('start_button');
const username_button = document.getElementById('username_button');
const end_menu = document.getElementById('end_menu');
const game = document.getElementById('game');
const setup_button = document.getElementById('setup_button');
const player_name_display = document.getElementById(`player_name_display`);
const scope_button = document.getElementById('scope_button');     // [ Toggle ] : show_ships
const shot_displays = document.querySelectorAll(".shot_indicator");

// [ Variables ] : Set-Up
const ship_color = "grey";
const strike_color = "whitesmoke";
const hit_color = "crimson";
let show_ships = false;
let ship_display_list = ["Destroyer", "Submarine", "Cruiser", "Battleship", "Aircraft Carrier"];
let ship_length_reference = [2, 3, 3, 4, 5];
let player_fleet = [[], [], [], [], []];
let cpu_fleet = [[], [], [], [], []];
let player_ships = [];
let cpu_ships = [];
let player_strikes = [];
let cpu_strikes = [];
let ship_display_count = 0;
let user_name;
let player_fleet_health = 17;
let cpu_fleet_health = 17;

// [ Setup ] : Event Listeners
start_button.addEventListener("click", () => {
    player_start.style.display = "none";
    player_input.style.display = "flex";
})  
username_button.addEventListener("click", () => {
    player_input.style.display = "none";
    player_setup.style.display = "flex";
    ship_display.innerHTML = ship_display_list[ship_display_count];
    user_name = player_name.value;
    ship_display.style.color = "white";
    player_name_display.innerHTML = `ADMIRAL ${user_name}`;
    
    // [ Loop ] : Populate Setup Grid
    let coordinates = [];
    display_grid(coordinates, setup_grid);
    // [ Loop ] : Place Player Ships
    place_ships(player_fleet, player_ships, coordinates);
}) 
scope_button.addEventListener("click", () => {
    scope();  
})

// [ Variables ] : In-Game
let game_coordinates = [];
let enemy_coordinates = [];

// [ System ] : Function calls 
display_grid(enemy_coordinates, war_grid);

// [ Key takeaway : A DOM element can only exist in one position in the DOM at a time. ]
//    [ Appending the same element repeatedly moves it rather than creating copies ]
//    [ When creating multiple new elements via for loop : 
//          move const coordinate_box = document.createElement() inside for loop 
//          instead of outside for loop ]

// [ Functions ] : Grid
function display_grid(coordinates, parent){
    // [ Conditional ] : Populate Grid
    if (coordinates.length === 0 ){
        // [ Conditional ] :  War Grid
        if(parent === war_grid){
            for(let i = 0; i < 100; i++){
                const coordinate_box = document.createElement("div");
        
                coordinate_box.style.width = "28px";
                coordinate_box.style.height = "28px";
                coordinate_box.style.border = "1px solid green";
                coordinate_box.id = `${i}`;
                coordinate_box.className = "war_box";

                coordinates.push(coordinate_box);

                parent.appendChild(coordinate_box);
            }
            strike(coordinates);
        } else if(parent === player_grid || parent === setup_grid){
            for(let i = 0; i < 100; i++){
                const coordinate_box = document.createElement("div");
        
                coordinate_box.style.width = "28px";
                coordinate_box.style.height = "28px";
                coordinate_box.style.border = "1px solid green";
                coordinate_box.id = `${i}`;
                coordinate_box.className = "war_box";

                coordinates.push(coordinate_box);

                parent.appendChild(coordinate_box);
            }
            if (parent === player_grid){
                // [ Loop ]
                for(let i = 0; i < coordinates.length; i++){
                    for(let j = 0; j < player_ships.length; j++){
                        if(parseInt(coordinates[i].id) === player_ships[j]){
                            coordinates[i].style.backgroundColor = ship_color;
                        }
                    }
                }                
            }
        }
    } else {
        // [ Conditional ] : Player Grid (Currently Shown)
        if(parent === player_grid){
            // [ Loop ] : Scan Player Grid
            for(let i = 0; i < coordinates.length; i++){
                // [ System ] : Place Ships
                for(let j = 0; j < player_ships.length; j++){
                    if(parseInt(coordinates[i].id) === player_ships[j]){
                        coordinates[i].style.backgroundColor = ship_color;
                    }
                }

                // [ System ] : Show Cpu Attacks
                for(let j = 0; j < cpu_strikes.length; j++){
                    if(parseInt(coordinates[i].id) === cpu_strikes[j]){
                        coordinates[i].style.backgroundColor = strike_color;
                        coordinates[i].style.animation = "missed_strike 0.3s alternate";
                        coordinates[i].style.animationIterationCount = "infinite";
                    }
                }

                // [ System ] : Hit Check
                for(let j = 0; j < player_ships.length; j++){
                    if(parseInt(coordinates[i].id) === player_ships[j]){
                        for(let k = 0; k < cpu_strikes.length; k++){
                            if(player_ships[j] === cpu_strikes[k]){
                                coordinates[i].style.backgroundColor = hit_color;
                                coordinates[i].style.animation = "hit_strike 0.3s alternate";
                                coordinates[i].style.animationIterationCount = "infinite";
                            }
                        }
                    }
                }
            }
        }
    }
}
function strike(coordinates){
    coordinates.forEach((coordinate) => {
        coordinate.addEventListener("click", () => {
            // [ Conditional ] : DUPLICATE
            if(coordinate.style.className == "hitbox"){
                console.log("Already Hit");
                return;     // Exit Function
            }
            // [ Loop ] : Iterate through CPU Ships
            for(let i = 0; i < cpu_ships.length; i++){
                // [ Conditional ] : HIT
                if(parseInt(coordinate.id) === cpu_ships[i]){
                    cpu_fleet_health--;
                    coordinate.style.backgroundColor = hit_color;
                    player_strikes.push(parseInt(coordinate.id));

                    console.log("ENEMY HIT !");
                    return;     // ( Exit Function )
                } 
            }

            coordinate.style.backgroundColor = strike_color;
            coordinate.style.animation = "missed_strike 0.3s alternate";
            coordinate.style.animationIterationCount = "infinite";
            coordinate.style.className = "hit_box";

            player_strikes.push(parseInt(coordinate.id));

            shot_displays.forEach((display) => {
                display.style.display = "flex";
            })
            setTimeout(() => {
                shot_displays.forEach((display) => {
                    display.style.display = "none";
                })
            }, 250);

            // [ CPU Attempt ] : cpu_strike()
            cpu_strike();

            // [ Debug ]
            console.log(`player_fleet_health : ${player_fleet_health}`);
            console.log(`cpu_fleet_health : ${cpu_fleet_health}`);
            // console.log(`player_strikes : [${player_strikes}]`); 
            // console.log(`cpu_strikes : [${cpu_strikes}]`);
        })
    })
}
function cpu_strike(){
    // [ Generate random strikes ]
    let strike = Math.floor(Math.random(0, 100) * 100);
    cpu_strikes.push(strike);

    // [ Loop ] : Iterate through Player Ships
    for (let i = 0; i < player_ships.length; i++){
        if(strike === player_ships[i]){
            player_fleet_health--;

            // [ Debug ]
            console.log("PLAYER HIT !!!");
        }
    }

    // [ Check Player Fleet ]
    display_grid(game_coordinates, player_grid);

    // console.log(`player_fleet_health : ${player_fleet_health}`);
    // console.log("cpu_strike()");
    // console.log(`cpu_strikes : [${cpu_strikes}]`);

}
function scope(){
    show_ships = !show_ships;

    // [ Conditional ]
    if (!show_ships){
        // [ Loop ] : Display War_Grid
        player_grid.style.display = "none";
        war_grid.style.display = "flex";
        grid_indicator.innerHTML = "ENEMY WATERS";
        grid_indicator.style.color = "rgb(117, 10, 31)";

        display_grid(enemy_coordinates, war_grid);
    } else {
        war_grid.style.display = "none";
        player_grid.style.display = "flex";
        grid_indicator.innerHTML = "PLAYER WATERS";
        grid_indicator.style.color = "whitesmoke";

        display_grid(game_coordinates, player_grid);
    }

    // [ Debug ]
    // console.log(`show_ships : ${show_ships}`);
}

// [ Functions ] : Set-up
function available_spaces(coordinate){
    const edges = [ 0,1,2,3,4,5,6,7,8,9,
                    10,20,30,40,50,60,70,80,
                    19,29,39,49,59,69,79,89,
                    90,91,92,93,94,95,96,97,98 ];

    let up = coordinate - 10;
    let down = coordinate + 10;
    let left = coordinate - 1;
    let right = coordinate + 1;
    let list = [up, down, left, right];
    let left_edge = [10, 20, 30, 40, 50, 60, 70, 80];
    let right_edge = [19, 29, 39, 49, 59, 69, 79, 89];

    // [ Loop ] : Top and Bottom Edges
    for(let i = 0; i < edges.length; i++){
        // [ Conditional ]
        if(coordinate === edges[i]){
            console.log('Edge Coordinate');
            // [ Conditional ] : Top Edge
            if(coordinate > 0 && coordinate < 9){
                list = [left, right, down];
            } else if (coordinate === 0){
                // [ Conditional ] : Top Left Corner
                list = [right, down];
            } else if (coordinate === 9){
                // [ Conditional ] : Top Right Corner
                list = [left, down];
            }
            // [ Conditional ] : Bottom Edge
            if(coordinate > 90 && coordinate < 99){
                list = [left, right, up];
            } else if (coordinate === 90){
                // [ Conditional ] : Bottom Left Corner
                list = [right, up];
            } else if (coordinate === 99){
                // [ Conditional ] : Bottom Right Corner
                list = [left, up];
            }
        }
    }

    // [ Loop ] : Left and Right Edges
    for(let i = 0; i < 8; i++){
        if(coordinate === left_edge[i]){
            list = [up, down, right];
        } else if (coordinate === right_edge[i]){
            list = [up, down, left];
        }
    }
    
    return list;
}
function place_ships(fleet, ships, coordinates){
    // [ Loop ] : Place Player Ships
    let open_spaces = [];
    let cpu_spaces = [];
    for(let i = 0; i < coordinates.length; i++){
        coordinates[i].addEventListener("click", ()=>{
            // [ Conditional ] : Duplicate Check
            if(coordinates[i].style.backgroundColor === ship_color){
                console.log("DUPLICATE");
            } else {
                // [ Conditional ] : Player Fleet Empty
                if (fleet[ship_display_count].length == 0 && cpu_fleet[ship_display_count].length == 0) {
                    fleet[ship_display_count].push(parseInt(coordinates[i].id));
                    ships.push(parseInt(coordinates[i].id));
                    coordinates[i].style.backgroundColor = ship_color;
                    open_spaces = available_spaces(parseInt(coordinates[i].id));

                    // CPU 
                    let location = Math.floor(Math.random(0, 100) * 100);
                    cpu_fleet[ship_display_count].push(parseInt(coordinates[location].id));
                    cpu_ships.push(parseInt(coordinates[location].id));
                    cpu_spaces = available_spaces(parseInt(coordinates[location].id));

                    // [ Loop ] : Display Available Spaces
                    for(let i = 0; i < open_spaces.length; i++){
                        // [ Conditional ] : Length ( TBA )
                        coordinates[open_spaces[i]].style.animation = "missed_strike 0.3s alternate";
                        coordinates[open_spaces[i]].style.animationIterationCount = "1";
                    }
                    console.log(`cpu_fleet`);
                    console.log(cpu_fleet);
                    console.log(`cpu_ships : [${cpu_ships}]`);

                    return; // Exit Function
                } 
                

                // [ Loop ] : Force available options ONLY
                let index = Math.floor(Math.random(0, cpu_spaces.length) * cpu_spaces.length);
                cpu_fleet[ship_display_count].push(cpu_spaces[index]);
                cpu_ships.push(cpu_spaces[index]);

                for(let j = 0; j < open_spaces.length; j++){
                    // [ Conditional ] : Coordinate Equals Open Space
                    if(parseInt(coordinates[i].id) == open_spaces[j]){
                        fleet[ship_display_count].push(parseInt(coordinates[i].id));
                        ships.push(parseInt(coordinates[i].id));
                        coordinates[i].style.backgroundColor = ship_color;
                        open_spaces = available_spaces(parseInt(coordinates[i].id));
                    }
                }

                // [ Conditional ] : Progress to Next Ship
                if(fleet[ship_display_count].length == ship_length_reference[ship_display_count] && ship_display_count <= 4){
                    // [ Conditional ] : Continue to Next Phase
                    if(ship_display_count >= 4){
                        player_setup.style.display = "none";
                        start_menu.style.display = "none";
                        game.style.display = "flex";
                    }
                    ship_display_count++;
                    open_spaces = [];
                    ship_display.innerHTML = ship_display_list[ship_display_count];
                }
                // [ Loop ] : Display Available Spaces
                for(let i = 0; i < open_spaces.length; i++){
                    // [ Conditional ] : Length ( TBA )
                    coordinates[open_spaces[i]].style.animation = "missed_strike 0.3s alternate";
                    coordinates[open_spaces[i]].style.animationIterationCount = "1";
                }
                console.log(`cpu_fleet`);
                console.log(cpu_fleet);
                console.log(`cpu_ships : [${cpu_ships}]`);
            }
        })
    }
}