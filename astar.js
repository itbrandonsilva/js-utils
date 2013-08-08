/*
 Represents a path that was found using FindPath().
*/

function Path () {
    this.tilePath     = [];
    this.checkedTiles = [];
};

/*
 HCost:
 "the estimated movement cost to move from that given square on 
 the grid to the final destination, point B. This is often referred to 
 as the heuristic, which can be a bit confusing. The reason why it is 
 called that is because it is a guess. We really don’t know the actual distance
 until we find the path, because all sorts of things can be in the way 
 (walls, water, etc.). You are given one way to calculate H in this tutorial, 
 but there are many others that you can find in other articles on the web."
 The HCost represents the <i>estimated</i> cost to get from the this tile to the end tile.
*/

/*
 GCost:
 "the movement cost to move from the starting point A to a given square on the grid, following the path generated to get there."
 The GCost represents the <i>real</i> cost to get from the starting tile to this tile.
*/

/*
 FCost:
 GCost + HCost
*/

function hcost(startX, startY, endX, endY) {
    var xDif = Math.abs(endX - startX);
    var yDif = Math.abs(endY - startY);
    var hcost = (xDif + yDif) * 10
    return hcost;
};

function Tile (p) {
    this.x =      p.x;
    this.y =      p.y;
    this.id =     p.id;
    // The parentId points to the tile that is part of the fastest path to this tile.
    this.pid =    p.pid;
    this.hcost =  p.hcost;
    this.gcost =  p.gcost;
    this.fcost =  p.hcost + p.gcost;
};

var adjacentTiles = [
    { x: 0, y: 1, cost: 10 },
    { x: -1, y: 0, cost: 10 },
    { x: 1, y: 0, cost: 10 },
    { x: 0, y: -1, cost: 10 }
];

// Find tile in tileArray by X and Y location.
function TileIndex(tileArray, x, y) {
    var tileIndex = -1;
    for (var i = 0, l = tileArray.length; i < l; ++i) {
        var tile = tileArray[i];
        if (tile.x == x && tile.y == y) {
            tileIndex = i;
            break;
        }
    }
    return tileIndex;
};

function FindPath (board, startX, startY, endX, endY, impassable) {
 
    // Callee can pass in an array of board values that are impassable.
    impassable = impassable || [];

    // Tiles that have yet to be traversed for a valid path.
    var OpenList   = [];
    // Tiles that we have already traversed in search for a valid path.
    // The closed list does <i>not</i> represent tiles that are not
    // part of a valid path, only tiles that we have already processed. 
    var ClosedList = [];
    // Used to identify individual tiles.
    var IdIndex = 0;

    // We will begin our search for a path at the starting tile.
    var startTile = new Tile({
        x: startX,
        y: startY,
        id: IdIndex++,
        pid: IdIndex,
        hcost: hcost(startX, startY, endX, endY),
        gcost: 0
    });
    OpenList.push(startTile);

    while (true) {

        var parentTile = null;

        // No more tiles to check? Path to be found does not exist.
        if (OpenList.length <= 0) break;

        // Find the tile with the lowest FCost in the open list, as that tile has the 
        // best chance of being being part of the final path (if a path is found). We 
        // will continue our search for a complete path through this tile.
        for (var i = 0, l = OpenList.length; i < l; ++i) {
            var tile = OpenList[i]
            if (!parentTile) parentTile = tile;
            else if (tile.fcost < parentTile.fcost) parentTile = tile;
        }

        // Move the chosen tile (parentTile) from the OpenList to the ClosedList, as after we are done 
        // processing this tile, we do not want to process it again.
        OpenList.splice(OpenList.indexOf(parentTile), 1);
        ClosedList.push(parentTile);

        // Did we succesfully find a path from the start tile to the end tile?
        if (parentTile.x === endX && parentTile.y === endY) {
            var path = new Path();
            path.tilePath.push({ x: endX, y: endY });

            var tile = parentTile;
            while( tile ) {
                var tileParentId = tile.pid;
                tile = null;
                for (var i = 0, l = ClosedList.length; i < l; ++i) {
                    if (ClosedList[i].id == tileParentId) {
	                    tile = ClosedList[i];
                        path.tilePath.push({ x: tile.x, y: tile.y });
                        break;
                    }
                }
            }
            path.tilePath.reverse();

            for (var i = 0, l = ClosedList.length; i < l; ++i) {
                tile = ClosedList[i];
                path.checkedTiles.push({ x: tile.x, y: tile.y });
            }

            return path;
        }

        // We prepare tiles adjacent to the tile we chose above (parentTile) for processing. 
        for (var i = 0, l = adjacentTiles.length; i < l; ++i) {
            
            var adjacentTile = adjacentTiles[i];
            var x      = parentTile.x + adjacentTile.x;
            var y      = parentTile.y + adjacentTile.y;
            var gcost  = parentTile.gcost + adjacentTile.cost;

            // Ignore impassable tiles.
            if (x < 0 || y < 0 || x > board.length-1 || y > board[0].length-1 || impassable.indexOf(board[x][y]) > -1) {
                continue;
            }

            // Ignore tiles that have already been processed (tiles that are in the closed list).
            var tileIndex = TileIndex(ClosedList, x, y);
            if (tileIndex > -1) {
                continue;
            }

            // Have we encountered this tile earlier, but have not processed it yet? If so, lets update that tile if necessary.
            var tileIndex = TileIndex(OpenList, x, y);
            if (tileIndex > -1) {
                // Is our new path to this tile faster than the previous path?
                if (gcost < OpenList[tileIndex].gcost) {
                    var tile = OpenList[tileIndex];
                    tile.pid = parentTile.id;
                    tile.gcost = gcost;
                    tile.fcost = gcost + tile.hcost;
                }
            // This tile will need to be processed; we have yet to encounter this tile in our search.
            } else {
                var tile = new Tile({
                    x: x,
                    y: y,
                    id: ++IdIndex,
                    pid: parentTile.id,
                    hcost: hcost(x, y, endX, endY),
                    gcost: gcost
                });
                OpenList.push(tile);
            }
        }
    }

    // No path was found.
    return null;
};


/* Uncomment to test.

var impassableTerrain = [1];
var TestBoard = [
    [0, 0, 0, 0], 
    [1, 1, 1, 0], 
    [1, 1, 1, 0], 
    [0, 0, 0, 0]
];

var path = FindPath(TestBoard, 0, 0, 3, 0, impassableTerrain);
if (path) console.log(JSON.stringify(path, null, 2));
else console.log("No path was found.");

*/
