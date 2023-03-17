import sha256 from 'js-sha256';
//this method is used to validate Shufti Pro response signature
function validatesignature(data, signature, SK) {
  data = JSON.stringify(data);
  data = data.replace(/\//g, "\\/")
  data = `${data}${SK}`;

  sha256(data);
  var hash = sha256.create();
  hash.update(data);

  if (hash.hex() === signature) {
    return true;
  } else {
    return false;
  }
}
const verifyDocument = async imageBase64 => {

  // const YOUR_CLIENT_ID = 'Df02pDEFsM7QxY6TwhYPAIrGDjJ1aEXPJKGIHRHLQBiveE7hcz1678256102';
  // const YOUR_SECRET_KEY = '$2y$10$aOwUQJEE15YOV6KFIV1/ouaPgdeI61JhbBdo/cJAX41d4fVEOOynm';
  // localStorage.setItem('shufti.client_id', "Df02pDEFs*******6102");
  // localStorage.setItem('shufti.secret_key', "$2y$*******nm")
  console.log("To setup keys for shufti: \nlocalStorage.setItem('shufti.client_id', 'Df02pDEFs*******6102'); \nlocalStorage.setItem('shufti.secret_key', '$2y$*******nm');");
  const YOUR_CLIENT_ID = localStorage.getItem('shufti.client_id');
  const YOUR_SECRET_KEY = localStorage.getItem('shufti.secret_key');

  let payload = {
    //your unique request reference
    "reference": `SP_REQUEST_${Math.random()}`,
    //URL where you will receive the webhooks from Shufti Pro
    "callback_url": "https://testing.com/profile/sp-notify-callback",
    //end-user email
    "email": "johndoe@example.com",
    //end-user country
    "country": "",
    //select ISO2 code for your desired language on verification screen
    "language": "EN",
    //what kind of proofs will be provided to Shufti Pro for verification?
    "verification_mode": "any",
    //allow end-user to upload verification proofs if the webcam is not accessible
    "allow_offline": "1",
    //allow end-user to upload real-time or already catured proofs
    "allow_online": "1",
    //privacy policy screen will be shown to end-user
    "show_privacy_policy": "1",
    //verification results screen will be shown to end-user
    "show_results": "1",
    //consent screen will not be shown to end-user
    "show_consent": "0",
    //User cannot send Feedback
    "show_feedback_form": "0",
  }
  payload['document'] = {
    'proof': imageBase64,
    'additional_proof': imageBase64,
    'name': "",
    'dob': "",
    'gender': "",
    'place_of_issue': "",
    'document_number': "",
    'expiry_date': "",
    'issue_date': "",
    'fetch_enhanced_data': "1",
    'supported_types': ['id_card', 'passport']
  }
  var token = btoa(`${YOUR_CLIENT_ID}:${YOUR_SECRET_KEY}`); //BASIC AUTH TOKEN
  //Dispatch request via fetch API or with whatever else which best suits for you
  return await postRequest(token, payload, YOUR_SECRET_KEY);
}

async function postRequest(token, payload, secretKey) {
  try {
    const response = await fetch('https://api.shuftipro.com/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + token
      },
      body: JSON.stringify(payload)
    });
    const responseSignature = response.headers.get('Signature');
    const data = await response.json();
    if (validatesignature(data, responseSignature, secretKey)) {
      console.log('signature validated', data);
    } else {
      console.log('signature not validated', data);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];

      resolve(`data:image/jpeg;base64,${base64}`);
    };
    reader.onerror = error => reject(error);
  });
}

export {
  verifyDocument,
  fileToBase64
}