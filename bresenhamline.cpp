// bresenhamline.cpp

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>

void drawBresenhamLine(int x1, int y1, int x2, int y2, std::vector<std::pair<int, int>> &result) {
    int dx = x2 - x1;
    int dy = y2 - y1;
    int x = x1, y = y1;

    result.push_back({x, y});

    int p = 2 * dy - dx;

    while (x < x2) {
        x++;

        if (p < 0) {
            p = p + 2 * dy;
        } else {
            y++;
            p = p + 2 * dy - 2 * dx;
        }

        result.push_back({x, y});
    }
}

int main(int argc, char *argv[]) {
    if (argc != 5) {
        std::cerr << "Usage: " << argv[0] << " x1 y1 x2 y2" << std::endl;
        return 1;
    }

    int x1 = std::stoi(argv[1]);
    int y1 = std::stoi(argv[2]);
    int x2 = std::stoi(argv[3]);
    int y2 = std::stoi(argv[4]);

    std::vector<std::pair<int, int>> result;
    drawBresenhamLine(x1, y1, x2, y2, result);

    // Output the coordinates to a file
    std::ofstream outputFile("output/bresenham_coordinates.txt");
    for (const auto &coord : result) {
        outputFile << coord.first << " " << coord.second << "\n";
    }
    outputFile.close();

    return 0;
}
