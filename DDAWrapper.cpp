// ddaline.cpp

#include <iostream>
#include <vector>

extern "C" {
    void drawDDALine(int x1, int y1, int x2, int y2, std::vector<std::pair<int, int>> &result) {
        int dx = x2 - x1;
        int dy = y2 - y1;

        int steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);

        float xIncrement = static_cast<float>(dx) / static_cast<float>(steps);
        float yIncrement = static_cast<float>(dy) / static_cast<float>(steps);

        float x = static_cast<float>(x1), y = static_cast<float>(y1);

        result.clear();

        // Store the coordinates in the result vector
        for (int k = 0; k < steps; k++) {
            result.push_back({static_cast<int>(x), static_cast<int>(y)});
            x += xIncrement;
            y += yIncrement;
        }
    }
}
