// Đọc file và hiển thị nội dung vào input text
document.getElementById("inputFile").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    document.getElementById("inputText").value = reader.result;
  };

  if (file) {
    reader.readAsText(file);
  }
});

// Mã hóa Caesar
function caesarCipher(str, shift) {
  shift = ((shift % 26) + 26) % 26;

  return str
    .split("")
    .map((char) => {
      let code = char.charCodeAt();

      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join("");
}

// Mã hóa thay thế
function substitutionCipher(str, key) {
  const alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphabetLower = "abcdefghijklmnopqrstuvwxyz";
  const keyMap = {};

  for (let i = 0; i < alphabetUpper.length; i++) {
    keyMap[alphabetUpper[i]] = key[i];
    keyMap[alphabetLower[i]] = key[i + 26];
  }

  return str
    .split("")
    .map((char) => keyMap[char] || char)
    .join("");
}

// Tạo hoán vị ngẫu nhiên
function generateRandomPermutation() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  for (let i = alphabet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
  }
  return alphabet.join("");
}

// Tạo hoán vị ngược
function generateInversePermutation(key) {
  const alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphabetLower = "abcdefghijklmnopqrstuvwxyz";
  const inverseKey = new Array(52);

  for (let i = 0; i < 26; i++) {
    inverseKey[key.charCodeAt(i) - 65] = alphabetUpper[i];
    inverseKey[key.charCodeAt(i + 26) - 97 + 26] = alphabetLower[i];
  }

  return inverseKey.join("");
}

// Mã hoá
document.getElementById("encodeBtn").addEventListener("click", function () {
  const inputText = document.getElementById("inputText").value;
  const encryptionType = document.getElementById("encryptionType").value;
  const key = parseInt(document.getElementById("key").value);
  const substitutionKey = document.getElementById("substitutionKey").value;
  const affineA = parseInt(document.getElementById("affineA").value);
  const affineB = parseInt(document.getElementById("affineB").value);

  if (encryptionType === "substitution" && substitutionKey) {
    const encodedText = substitutionCipher(inputText, substitutionKey);
    document.getElementById("encodedText").value = encodedText;
  } else if (encryptionType === "caesar" && !isNaN(key)) {
    const encodedText = caesarCipher(inputText, key);
    document.getElementById("encodedText").value = encodedText;
  } else if (
    encryptionType === "affine" &&
    !isNaN(affineA) &&
    !isNaN(affineB)
  ) {
    const encodedText = affineEncrypt(inputText, affineA, affineB);
    document.getElementById("encodedText").value = encodedText;
  } else {
    alert("Vui lòng nhập khóa hợp lệ!");
  }
});

// Giải mã
document.getElementById("decodeBtn").addEventListener("click", function () {
  const inputText = document.getElementById("inputText").value;
  const encryptionType = document.getElementById("encryptionType").value;
  const key = parseInt(document.getElementById("key").value);
  const substitutionKey = document.getElementById("substitutionKey").value;
  const affineA = parseInt(document.getElementById("affineA").value);
  const affineB = parseInt(document.getElementById("affineB").value);

  if (encryptionType === "substitution" && substitutionKey) {
    const inverseKey = generateInversePermutation(substitutionKey);
    const decodedText = substitutionCipher(inputText, inverseKey);
    document.getElementById("decodedText").value = decodedText;
  } else if (encryptionType === "caesar" && !isNaN(key)) {
    const decodedText = caesarCipher(inputText, -key);
    document.getElementById("decodedText").value = decodedText;
  } else if (
    encryptionType === "affine" &&
    !isNaN(affineA) &&
    !isNaN(affineB)
  ) {
    try {
      const decodedText = affineDecrypt(inputText, affineA, affineB);
      document.getElementById("decodedText").value = decodedText;
    } catch (error) {
      alert("Khóa a không có nghịch đảo. Vui lòng nhập giá trị khác.");
    }
  } else {
    alert("Vui lòng nhập khóa hợp lệ!");
  }
});

// Tính nghịch đảo của a trong modulo m
function modInverse(a, m) {
  for (let i = 1; i < m; i++) {
    if ((a * i) % m === 1) {
      return i;
    }
  }
  throw new Error("a và m không có nghịch đảo.");
}

// Mã hóa Affine
function affineEncrypt(str, a, b) {
  const m = 26;
  return str
    .split("")
    .map((char) => {
      let code = char.charCodeAt();
      if (code >= 65 && code <= 90) {
        // Uppercase letters
        return String.fromCharCode(((a * (code - 65) + b) % m) + 65);
      } else if (code >= 97 && code <= 122) {
        // Lowercase letters
        return String.fromCharCode(((a * (code - 97) + b) % m) + 97);
      }
      return char;
    })
    .join("");
}

// Giải mã Affine
function affineDecrypt(str, a, b) {
  const m = 26;
  const a_inv = modInverse(a, m);
  return str
    .split("")
    .map((char) => {
      let code = char.charCodeAt();
      if (code >= 65 && code <= 90) {
        // Uppercase letters
        return String.fromCharCode(((a_inv * (code - 65 - b + m)) % m) + 65);
      } else if (code >= 97 && code <= 122) {
        // Lowercase letters
        return String.fromCharCode(((a_inv * (code - 97 - b + m)) % m) + 97);
      }
      return char;
    })
    .join("");
}

// Hàm kiểm tra ước chung lớn nhất (gcd) giữa a và m
function gcd(a, b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

// Tạo cặp khóa ngẫu nhiên cho Affine Cipher
function generateRandomAffineKey() {
  const possibleAValues = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
  const randomA =
    possibleAValues[Math.floor(Math.random() * possibleAValues.length)];
  const randomB = Math.floor(Math.random() * 26);
  return { a: randomA, b: randomB };
}

// Auto-generate key
document
  .getElementById("autoGenerateKeyBtn")
  .addEventListener("click", function () {
    let options = document.getElementById("encryptionType").value;
    console.log(options);
    if (options === "substitution") {
      const randomKey = generateRandomPermutation();
      document.getElementById("substitutionKey").value = randomKey;
    } else if (options === "caesar") {
      const randomKey = Math.floor(Math.random() * 26);
      document.getElementById("key").value = randomKey;
    } else if (options === "affine") {
      const affineKey = generateRandomAffineKey();
      document.getElementById("affineA").value = affineKey.a;
      document.getElementById("affineB").value = affineKey.b;
    }
  });

// Export file
document.getElementById("exportFileBtn").addEventListener("click", function () {
  const encodedText = document.getElementById("encodedText").value;
  const keepOriginalFile = document.getElementById("keepOriginalFile").checked;
  const blob = new Blob([encodedText], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "encoded_text.txt";
  link.click();

  if (!keepOriginalFile) {
    document.getElementById("inputText").value = "";
    document.getElementById("encodedText").value = "";
    document.getElementById("decodedText").value = "";
  }
});
