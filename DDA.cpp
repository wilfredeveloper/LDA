// ddaline.cpp

#include <iostream>
#include <vector>
#include <sstream>

void drawDDALine(int x1, int y1, int x2, int y2, std::vector<std::pair<int, int>> &result) {
    int dx = x2 - x1;
    int dy = y2 - y1;

    int steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);

    float xIncrement = static_cast<float>(dx) / static_cast<float>(steps);
    float yIncrement = static_cast<float>(dy) / static_cast<float>(steps);

    float x = static_cast<float>(x1), y = static_cast<float>(y1);

    // Store the coordinates in the result vector
    for (int k = 0; k < steps; k++) {
        result.push_back({static_cast<int>(x), static_cast<int>(y)});
        x += xIncrement;
        y += yIncrement;
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
    drawDDALine(x1, y1, x2, y2, result);

    // Print the resulting coordinates
    for (const auto &coord : result) {
        std::cout << "(" << coord.first << ", " << coord.second << ") ";
    }

    return 0;
}
