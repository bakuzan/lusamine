from argparse import ArgumentParser
from os import listdir, path, sep
import sys
import cv2
import math
import numpy as np
import warnings


COLUMNS = 30


def concat_images(img_num, imga, imgb):
    """
    Combines two image ndarrays.
    imga is starts from 0, 0
    imgb is placed according to the img_num in the appropriate x, y location
    """
    ha, wa = imga.shape[:2]
    hb, wb = imgb.shape[:2]

    current_row = math.floor(img_num / COLUMNS)
    current_col = img_num % COLUMNS

    h_curr = current_row * hb
    w_curr = current_col * wb

    total_width = COLUMNS * wb
    max_height = h_curr + hb

    new_img = np.zeros(shape=(max_height, total_width, 4))
    new_img[:ha, :wa] = imga
    new_img[h_curr:h_curr+hb, w_curr:w_curr+wb] = imgb
    return new_img


def concat_n_images(images_directory):
    """
    Combines images from a directory.
    """
    output = None
    files = listdir(images_directory)

    for i, filename in enumerate(files):
        img_path = images_directory + sep + filename
        img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)

        print("Adding {0}...".format(filename), flush=True)

        if i == 0:
            output = img
        else:
            output = concat_images(i, output, img)

    return output


if __name__ == "__main__":
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")

        parser = ArgumentParser()

        parser.add_argument("sheet",
                            choices=['art', 'sprites'],
                            help="Create new spritesheet")

        args = parser.parse_args()
        sheet = args.sheet

        print("----- Lusamine spritesheet generator -----")
        print("Creating new {0} sheet...".format(sheet))

        path_to_here = path.dirname(__file__)
        target_path = path.abspath(
            path.join(path_to_here, sheet)
        )
        output_path = path.abspath(
            path.join(path_to_here, "{0}.png".format(sheet))
        )

        output = concat_n_images(target_path)
        is_done = cv2.imwrite(output_path, output)

        if is_done:
            print("{0} sheet created.".format(sheet.capitalize()))

    sys.exit(0)
