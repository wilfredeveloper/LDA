#include <iostream>

int main() {
    // Create a 32-bit integer with a known value
    uint32_t testValue = 0x12345678;

    // Interpret the value as an array of bytes
    uint8_t* bytes = reinterpret_cast<uint8_t*>(&testValue);

    // Check the byte order
    if (bytes[0] == 0x78 && bytes[1] == 0x56 && bytes[2] == 0x34 && bytes[3] == 0x12) {
        std::cout << "Little-endian" << std::endl;
    } else if (bytes[0] == 0x12 && bytes[1] == 0x34 && bytes[2] == 0x56 && bytes[3] == 0x78) {
        std::cout << "Big-endian" << std::endl;
    } else {
        std::cout << "Unknown endianness" << std::endl;
    }

    return 0;
}
