const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());


app.use(express.text({ type: "application/json" }));


const FULL_NAME = "samarthya alok";
const DOB_DDMMYYYY = "21112004";
const EMAIL = "samarthya777@gmail.com";
const ROLL = "22BCE0460";

const USER_ID = `${FULL_NAME}_${DOB_DDMMYYYY}`;


const isNumericStr = (s) => /^-?\d+$/.test(s);
const isAlphaStr = (s) => /^[A-Za-z]+$/.test(s);


app.use((req, res, next) => {
  if (typeof req.body === "string") {
    try {
      
      let cleanBody = req.body.replace(/[“”‘’]/g, '"');

      
      req.body = JSON.parse(cleanBody);
    } catch (err) {
      return res.status(400).json({
        error: "Invalid JSON after sanitization",
        details: err.message
      });
    }
  }
  next();
});


app.post("/bfhl", (req, res) => {
  try {
    const data = req.body?.data;

    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        user_id: USER_ID,
        email: EMAIL,
        roll_number: ROLL,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: ""
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0n;
    const alphaChars = [];

    for (const raw of data) {
      const s = String(raw);

      if (isNumericStr(s)) {
        const val = BigInt(s);
        sum += val;
        (val % 2n === 0n ? even_numbers : odd_numbers).push(s);
      } else if (isAlphaStr(s)) {
        alphabets.push(s.toUpperCase());
        for (const ch of s) if (/[A-Za-z]/.test(ch)) alphaChars.push(ch);
      } else {
        special_characters.push(s);
        for (const ch of s) if (/[A-Za-z]/.test(ch)) alphaChars.push(ch);
      }
    }

    
    alphaChars.reverse();
    let concat = "";
    alphaChars.forEach((ch, i) => {
      concat += i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
    });

    return res.status(200).json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string: concat
    });
  } catch (e) {
    return res.status(200).json({
      is_success: false,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: ""
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on :${PORT}`));
