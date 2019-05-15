#include<string.h>
#include<cstring>
#include<iostream> 
#include<cstdlib>
#include<stdio.h>

#include "bitmap/bitmap_image.hpp"

//#define TERRAIN_HEIGHT 	0.10f
//#define PIXEL_SIZE		0.05f

void writeObstacles(bitmap_image* image, const char* filename, float terrain_height, float pixel_size);

int main(int argc, char const *argv[])
{
	if(argc == 5) {
		std::string file_name(argv[1]);
		bitmap_image image(file_name);

		float terrain_height = atof(argv[3]);
		float pixel_size = atof(argv[4]);
		
		writeObstacles(&image, argv[2], terrain_height, pixel_size);
	}
	else {
		printf("Usage : %s source_image_path output_file terrain_max_height bloc_size\n", argv[0]);
	}
	return 0;
}

void writeObstacles(bitmap_image* image, const char* filename, float terrain_height, float pixel_size) {
	FILE* f = fopen(filename, "w");

	for(int i = 0; i < image->height(); i++) {
		for(int j = 0; j < image->width(); j++) {

			unsigned char pixR, pixG, pixB;
			image->get_pixel(i, j, pixR, pixG, pixB);
			float height = (1.0f - (pixR + pixG + pixB) / 3.0f / 255.0f) * terrain_height;
			float pos_x = pixel_size * (j - image->width() / 2.0f + 0.5f);
			float pos_y = pixel_size * (i - image->height() / 2.0f + 0.5f);
			if(height > 0.01f) {
				//x-position y-position x-length y-length z-length density 
				fprintf(f, "%f %f %f %f %f %f\n",pos_x, pos_y, pixel_size, pixel_size, height, 0.0f);
			}
		}
	}
	
	fclose(f);
}