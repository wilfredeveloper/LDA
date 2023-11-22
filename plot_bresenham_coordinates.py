import matplotlib.pyplot as plt
import numpy as np

# Read coordinates from file
coordinates = np.loadtxt('bresenham_coordinates.txt')

# Plot the graph
plt.plot(coordinates[:, 0], coordinates[:, 1], marker='o', linestyle='-', color='r')
plt.title('Bresenham Line Drawing')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.grid(True)
plt.show()
