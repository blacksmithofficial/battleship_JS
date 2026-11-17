/* BATTLESHIP  */

// [ DOM ] : Elements
const start_menu = document.getElementById('start_menu');
const player_start = document.getElementById('player_start');
const player_input = document.getElementById('player_input');
const player_setup = document.getElementById('player_setup');
const player_name = document.getElementById('player_name');
const ship_display = document.getElementById('ship_display');
const setup_grid = document.getElementById('setup_grid');
const start_button = document.getElementById('start_button');
const username_button = document.getElementById('username_button');
const end_menu = document.getElementById('end_menu');
const game = document.getElementById('game');
const setup_button = document.getElementById('setup_button');

// [ Setup ] : Variables
const ship_color = "grey";
let ship_display_list = ["Destroyer", "Submarine", "Cruiser", "Battleship", "Aircraft Carrier"];
let ship_length_reference = [2, 3, 3, 4, 5];
let player_fleet = [[], [], [], [], []];
let ship_display_count = 0;

// [ Setup ] : Event Listeners
start_button.addEventListener("click", () => {
    player_start.style.display = "none";
    player_input.style.display = "flex";
})  
username_button.addEventListener("click", () => {
    player_input.style.display = "none";
    player_setup.style.display = "flex";
    ship_display.innerHTML = ship_display_list[ship_display_count];
    ship_display.style.color = "white";

    // [ Populate Setup Grid ]
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

    // [ Place Your Ships ]
    coordinates.forEach((coordinate) => {
        coordinate.addEventListener("click", () => {
            // [ Conditional ] : Duplicate Check
            if(coordinate.style.backgroundColor === ship_color){
                // [ Conditional ] : Duplicate Check
                console.log("DUPLICATE");
            } else {
                player_fleet[ship_display_count].push(parseInt(coordinate.id));
                coordinate.style.backgroundColor = ship_color;

                // [Conditional]
                if(player_fleet[ship_display_count].length == ship_length_reference[ship_display_count] && ship_display_count <= 4){
                    ship_display_count++;
                        if(ship_display_count === 5){
                            // [Continue to Next Phase]
                            console.log("continue");
                            player_setup.style.display = "none";
                            start_menu.style.display = "none";
                            game.style.display = "flex";
                        }
                    ship_display.innerHTML = ship_display_list[ship_display_count];    
                } 
            }

            // [ Debug ]
            // console.log(coordinate.id);
            // console.log(player_fleet);
            console.log(ship_display_count);
        })
    })

    // [ Debug ]
    // console.log(setup_grid.children.length);
    // console.log(coordinates.length);
    // console.log(player_fleet);
}) 

// [ Key takeaway : A DOM element can only exist in one position in the DOM at a time. ]
//    [ Appending the same element repeatedly moves it rather than creating copies ]
//    [ When creating multiple new elements via for loop : 
//          move const coordinate_box = document.createElement() inside for loop 
//          instead of outside for loop ]


