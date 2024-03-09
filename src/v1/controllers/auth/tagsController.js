import QRCode from "qrcode";
import { BAD, OK } from "../../helpers/responseHelper.js";
import Tag from "../../models/tags.js";
import config from "../../../../config/config.js";
import user from "../../models/user.js";
import sendEmail from "../../utils/sendEmail.js";
import verifiedEmailText from "../../lib/verifiedEmailText.js";

export const getDataFromTagController = async (req, res, next) => {
  try {
    const tagId = req.params.tagId;
    const tagData = await Tag.findById(tagId, "-imageURL").populate({
      path: "userId",
      select: "-password -otp -verified -hideProfile -myTags -expTime",
    });
    if (!tagData) {
      return BAD(res, "", "Bad request", false);
    }
    if (tagData.notification) {
      let emailContext = `${tagData.name} has been scanned`;
      let alertText = verifiedEmailText(tagData.userId.name, emailContext);
      await sendEmail(tagData.userId.email, "Alert from rescueTag", alertText);
    }
    OK(res, tagData, "", true);
  } catch (err) {
    console.log(err);
  }
};
export const emergencyAlertController = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const userDetails = await user.findById(
      userId,
      "name",
      "emergencyContacts"
    );
    let emailContext = `${userDetails.name} rescueTag has been scanned .Try to connect with`;
    let alertText = verifiedEmailText(user.name, emailContext);
    let emergencyContacts = userDetails.emergencyContacts;
    emergencyContacts.map(async (user) => {
      await sendEmail(user.email, "Alert from rescueTag", alertText);
    });
    const result = await Promise.all(emergencyContacts);
    if(!result){
      throw Error("Something went wrong Try again later")
    }
    OK(res,"", "Message send....",true);
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
