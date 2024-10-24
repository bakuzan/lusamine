from argparse import ArgumentParser
from os import listdir, path, sep
import sys
import cv2
import math
import numpy as np
import warnings


COLUMNS = 30
PADDING = 10

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


def scale_image(image, required_h, required_w):
    h, w = image.shape[:2]

    if required_h == h and required_w == w:
        return image

    hori = 0
    vert = 0
    
    # If the image isn't square, it means the image has no built-in padding
    # We will square and pad the image so it is more uniform in size with the other images
    if h != w:
        vert = (math.ceil((w - h) / 2) if h < w else 0) + PADDING
        hori = (math.ceil((h - w) / 2) if h > w else 0) + PADDING
        image = cv2.copyMakeBorder(image, vert, vert, hori, hori, cv2.BORDER_CONSTANT)
        h += vert * 2
        w += hori * 2

    dx = required_w / w
    dy = required_h / h

    print(
        "Scaling image from {0}x{1} to {2}x{3}...".format(
            w, h, required_w, required_h),
        flush=True)

    return cv2.resize(image, (0, 0), fx=dx, fy=dy)


def concat_n_images(images_directory):
    """
    Combines images from a directory.
    """
    output = None
    files = listdir(images_directory)
    img_h = 0
    img_w = 0

    for i, filename in enumerate(files):
        img_path = images_directory + sep + filename
        img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)

        if i == 0:
            img_h, img_w = img.shape[:2]

        print("Adding {0}...".format(filename), flush=True)
        img = scale_image(img, img_h, img_w)

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
