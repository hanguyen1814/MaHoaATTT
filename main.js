// Hàm để hiển thị form-group dựa trên loại mã hóa được chọn
function updateKeyInputVisibility() {
  const encryptionType = document.getElementById("encryptionType").value;

  // Ẩn tất cả các form-group trước
  document.getElementById("caesarKeyGroup").style.display = "none";
  document.getElementById("substitutionKeyGroup").style.display = "none";
  document.getElementById("affineKeyGroup").style.display = "none";
  document.getElementById("vigenereKeyGroup").style.display = "none";
  document.getElementById("desKeyGroup").style.display = "none";
  document.getElementById("rsaKeyGroup").style.display = "none";

  // Hiển thị form-group tương ứng
  if (encryptionType === "caesar") {
    document.getElementById("caesarKeyGroup").style.display = "block";
  } else if (encryptionType === "substitution") {
    document.getElementById("substitutionKeyGroup").style.display = "block";
  } else if (encryptionType === "affine") {
    document.getElementById("affineKeyGroup").style.display = "block";
  } else if (encryptionType === "vigenere") {
    document.getElementById("vigenereKeyGroup").style.display = "block";
  } else if (encryptionType === "des") {
    document.getElementById("desKeyGroup").style.display = "block";
  } else if (encryptionType === "rsa") {
    document.getElementById("rsaKeyGroup").style.display = "block";
  }
}

// Thêm sự kiện 'change' cho dropdown để cập nhật các form-group
document
  .getElementById("encryptionType")
  .addEventListener("change", updateKeyInputVisibility);

// Gọi hàm này để thiết lập hiển thị ban đầu
updateKeyInputVisibility();

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
  } else if (
    encryptionType === "vigenere" &&
    document.getElementById("vigenereKey").value !== undefined
  ) {
    const encodedText = vigenereEncrypt(
      inputText,
      document.getElementById("vigenereKey").value
    );
    document.getElementById("encodedText").value = encodedText;
  } else if (encryptionType === "des") {
    const desKey = document.getElementById("desKey").value;
    const encodedText = desEncrypt(inputText, desKey);
    document.getElementById("encodedText").value = encodedText;
  } else if (encryptionType === "rsa") {
    const rsaPublicKey = document.getElementById("rsaPublicKey").value;
    const encodedText = rsaEncrypt(inputText, rsaPublicKey);
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
  } else if (
    encryptionType === "vigenere" &&
    document.getElementById("vigenereKey").value !== undefined
  ) {
    const decodedText = vigenereDecrypt(
      inputText,
      document.getElementById("vigenereKey").value
    );
    document.getElementById("decodedText").value = decodedText;
  } else if (encryptionType === "des") {
    const desKey = document.getElementById("desKey").value;
    const decodedText = desDecrypt(inputText, desKey);
    document.getElementById("decodedText").value = decodedText;
  } else if (encryptionType === "rsa") {
    const rsaPrivateKey = document.getElementById("rsaPrivateKey").value;
    const decodedText = rsaDecrypt(inputText, rsaPrivateKey);
    document.getElementById("decodedText").value = decodedText;
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

// Mã hóa Vigenère
function vigenereEncrypt(plainText, key) {
  let encryptedText = "";
  key = key.toLowerCase();
  for (let i = 0, j = 0; i < plainText.length; i++) {
    let currentLetter = plainText[i];
    if (/[a-zA-Z]/.test(currentLetter)) {
      // Kiểm tra ký tự là chữ cái
      let base = currentLetter === currentLetter.toUpperCase() ? 65 : 97;
      encryptedText += String.fromCharCode(
        ((currentLetter.charCodeAt(0) -
          base +
          (key[j % key.length].charCodeAt(0) - 97)) %
          26) +
          base
      );
      j++; // Chỉ tăng j khi là chữ cái
    } else {
      encryptedText += currentLetter;
    }
  }
  return encryptedText;
}

// Giải mã Vigenère
function vigenereDecrypt(cipherText, key) {
  let decryptedText = "";
  key = key.toLowerCase();
  for (let i = 0, j = 0; i < cipherText.length; i++) {
    let currentLetter = cipherText[i];
    if (/[a-zA-Z]/.test(currentLetter)) {
      // Kiểm tra ký tự là chữ cái
      let base = currentLetter === currentLetter.toUpperCase() ? 65 : 97;
      decryptedText += String.fromCharCode(
        ((currentLetter.charCodeAt(0) -
          base -
          (key[j % key.length].charCodeAt(0) - 97) +
          26) %
          26) +
          base
      );
      j++; // Chỉ tăng j khi là chữ cái
    } else {
      decryptedText += currentLetter;
    }
  }
  return decryptedText;
}

// Tạo một key ngẫu nhiên cho Vigenère
function generateRandomVigenereKey(length) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomKey = "";
  for (let i = 0; i < length; i++) {
    randomKey += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return randomKey;
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
    } else if (options === "vigenere") {
      const randomKey = generateRandomVigenereKey(6); // Chiều dài 6 ký tự, có thể tùy chỉnh
      document.getElementById("vigenereKey").value = randomKey;
    }
    if (options === "des") {
      const desKey = generateDesKey();
      document.getElementById("desKey").value = desKey;
    } else if (options === "rsa") {
      const { publicKey, privateKey } = generateRsaKeyPair();
      document.getElementById("rsaPublicKey").value = publicKey;
      document.getElementById("rsaPrivateKey").value = privateKey;
    }
  });

// Mã hóa DES
function desEncrypt(plainText, key) {
  return CryptoJS.DES.encrypt(plainText, key).toString();
}

// Giải mã DES
function desDecrypt(cipherText, key) {
  return CryptoJS.DES.decrypt(cipherText, key).toString(CryptoJS.enc.Utf8);
}

// Mã hóa RSA
function rsaEncrypt(plainText, publicKey) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(plainText);
}

// Giải mã RSA
function rsaDecrypt(cipherText, privateKey) {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  return decrypt.decrypt(cipherText);
}

function generateDesKey() {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let desKey = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    desKey += charset[randomIndex];
  }
  return desKey;
}
function generateRsaKeyPair() {
  const encrypt = new JSEncrypt({ default_key_size: 1024 }); // Kích thước khóa mặc định là 1024 bit
  const publicKey = encrypt.getPublicKey();
  const privateKey = encrypt.getPrivateKey();
  return { publicKey, privateKey };
}

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
