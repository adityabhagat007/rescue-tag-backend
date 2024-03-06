import QRCode from "qrcode";
import { BAD, OK } from "../../helpers/responseHelper.js";
import Tag from "../../models/tags.js";
import config from "../../../../config/config.js";
import user from "../../models/user.js";

export const getDataFromTag = async (req,res,next) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const userData = await user.findById(userId);
    if(!userData){
      return BAD(res,"","Bad request",false);
    }
    console.log(userData);
    OK(res,userData,"",true);
  } catch (err) {
    console.log(err);
  }
};

export const createTagController = async (req, res, next) => {
  try {
    const { name, tagType, userId, email, description } = req.body;
    const tagDetails = {
      userId: userId,
      tagType: tagType,
      name: name,
      description: description,
      userId: userId,
    };

    const tag = await Tag.create(tagDetails);
    const link = `${config.CLIENT_URL}/tag/${tag._id}`;

    const qr = await QRCode.toDataURL(
      link,
      { errorCorrectionLevel: "H" },
      { color: { light: "#FFF338" } }
    );
    const updatedTag = await Tag.findByIdAndUpdate(
      tag._id,
      { qrLink: link, imageURL: qr },
      { new: true }
    );
    OK(res, updatedTag, "Scan Now");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
