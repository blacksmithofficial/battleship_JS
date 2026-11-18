/* BATTLESHIP  */

// [ DOM ] : Elements
const start_menu = document.getElementById('start_menu');
const player_start = document.getElementById('player_start');
const player_input = document.getElementById('player_input');
const player_setup = document.getElementById('player_setup');
const player_name = document.getElementById('player_name');
const ship_display = document.getElementById('ship_display');
const setup_grid = document.getElementById('setup_grid');
const war_grid = document.getElementById('war_grid');
const start_button = document.getElementById('start_button');
const username_button = document.getElementById('username_button');
const end_menu = document.getElementById('end_menu');
const game = document.getElementById('game');
const setup_button = document.getElementById('setup_button');
const player_name_display = document.getElementById(`player_name_display`);

// [ Setup ] : Variables
const ship_color = "grey";
const strike_color = "whitesmoke";
const hit_color = "crimson";
let ship_display_list = ["Destroyer", "Submarine", "Cruiser", "Battleship", "Aircraft Carrier"];
let ship_length_reference = [2, 3, 3, 4, 5];
let player_fleet = [[], [], [], [], []];
let ship_display_count = 0;
let user_name;

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
    for(let i = 0; i < 100; i++){
        const coordinate_box = document.createElement("div");
        
        coordinate_box.style.width = "28px";
        coordinate_box.style.height = "28px";
        coordinate_box.style.border = "1px solid green";
        coordinate_box.id = `${i}`;
        coordinate_box.className = "coordinate_box";

        coordinates.push(coordinate_box);

        setup_grid.appendChild(coordinate_box);
    }

    // [ Loop ] : Scan Every Cooordinate Box
    let open_spaces = [];
    for(let i = 0; i < coordinates.length; i++){
        coordinates[i].addEventListener("click", ()=>{
            // [ Conditional ] : Duplicate Check
            if(coordinates[i].style.backgroundColor === ship_color){
                console.log("DUPLICATE");
            } else {
                // [ Conditional ] : Player Fleet Empty
                if (player_fleet[ship_display_count].length == 0) {
                    player_fleet[ship_display_count].push(parseInt(coordinates[i].id));
                    coordinates[i].style.backgroundColor = ship_color;
                    open_spaces = available_spaces(parseInt(coordinates[i].id));
                } 
                // [ Loop ] : Force available options ONLY
                for(let j = 0; j < open_spaces.length; j++){
                    // [ Conditional ] : Coordinate Equals Open Space
                    if(parseInt(coordinates[i].id) == open_spaces[j]){
                        player_fleet[ship_display_count].push(parseInt(coordinates[i].id));
                        coordinates[i].style.backgroundColor = ship_color;
                        open_spaces = available_spaces(parseInt(coordinates[i].id));
                    }
                }
                // [ Conditional ] : Progress to Next Ship
                if(player_fleet[ship_display_count].length == ship_length_reference[ship_display_count] && ship_display_count <= 4){
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
            }
        })
    }
}) 

// [ Loop ] : Populate War_Grid
let coordinates = [];
for(let i = 0; i < 100; i++){
    const coordinate_box = document.createElement("div");
        
    coordinate_box.style.width = "28px";
    coordinate_box.style.height = "28px";
    coordinate_box.style.border = "1px solid green";
    coordinate_box.id = `${i}`;
    coordinate_box.className = "war_box";

    coordinates.push(coordinate_box);

    war_grid.appendChild(coordinate_box);
}

// [ Key takeaway : A DOM element can only exist in one position in the DOM at a time. ]
//    [ Appending the same element repeatedly moves it rather than creating copies ]
//    [ When creating multiple new elements via for loop : 
//          move const coordinate_box = document.createElement() inside for loop 
//          instead of outside for loop ]

strike();

// [ Functions ] : Grid
function strike(){
    coordinates.forEach((coordinate) => {
        coordinate.addEventListener("click", () => {
            coordinate.style.backgroundColor = strike_color;
            coordinate.style.animation = "missed_strike 0.3s alternate";
            coordinate.style.animationIterationCount = "infinite";
        })
    })
}
function scope(){

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