/* Quality Assessment Toolkit — English / Odia (ଓଡ଼ିଆ) layer.
 *
 * 1. UI text      : exact-match dictionary + a few patterns (this file). English stays in the source;
 *                   a DOM translator swaps text nodes / placeholders / titles when Odia is on.
 * 2. Checklist    : official NQAS / Kayakalp wording is NEVER replaced. When Odia is on, the Odia
 *                   rendering is shown *under* the English line (window.TC), taken from
 *                   data/or-checklist.json. Anything not yet translated simply shows English only.
 * 3. Exports      : XLSX / ZIP downloads stay in the official English wording.
 *
 * Language is stored in localStorage 'qat_lang' ('en' | 'or') — the same key the login screen already used.
 */
(function () {
  'use strict';
  var KEY = 'qat_lang';
  function getLang() { try { return localStorage.getItem(KEY) === 'or' ? 'or' : 'en'; } catch (e) { return 'en'; } }
  var lang = getLang();

  /* ---------------------------------------------------------------- UI dictionary (English -> Odia) */
  var UI = {
    /* titles / cover */
    'Quality Assessment Toolkit': 'ଗୁଣବତ୍ତା ମୂଲ୍ୟାଙ୍କନ ଟୁଲକିଟ୍',
    'Kayakalp': 'କାୟାକଳ୍ପ',
    'NQAS (National Quality Assurance Standards) · Kayakalp (Clean Hospitals)': 'NQAS (ଜାତୀୟ ଗୁଣବତ୍ତା ନିଶ୍ଚିତକରଣ ମାନକ) · କାୟାକଳ୍ପ (ସ୍ୱଚ୍ଛ ହସ୍ପିଟାଲ)',
    'National Quality Assurance Standards — DH, CHC, PHC, UPHC, AAM-SHC checklists & scoring': 'ଜାତୀୟ ଗୁଣବତ୍ତା ନିଶ୍ଚିତକରଣ ମାନକ — DH, CHC, PHC, UPHC, AAM-SHC ଚେକ୍‌ଲିଷ୍ଟ ଓ ସ୍କୋରିଂ',
    'Clean Hospitals — DH/SDH/CHC, PHC, UPHC/APHC and AAM-SC checklists & scoring': 'ସ୍ୱଚ୍ଛ ହସ୍ପିଟାଲ — DH/SDH/CHC, PHC, UPHC/APHC ଓ AAM-SC ଚେକ୍‌ଲିଷ୍ଟ ଓ ସ୍କୋରିଂ',
    'Facility assessment for public health facilities': 'ସରକାରୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରଗୁଡ଼ିକ ପାଇଁ ମୂଲ୍ୟାଙ୍କନ',
    'Works offline · Install it from your browser menu · Tap ⌂ Home in the app to return here': 'ଅଫଲାଇନ୍‌ରେ ଚାଲେ · ବ୍ରାଉଜର୍ ମେନୁରୁ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ · ଏଠାକୁ ଫେରିବାକୁ ଆପ୍‌ରେ ⌂ ହୋମ୍ ଦବାନ୍ତୁ',
    'NQAS assessment': 'NQAS ମୂଲ୍ୟାଙ୍କନ',
    'Kayakalp — Clean Hospitals Assessment': 'କାୟାକଳ୍ପ — ସ୍ୱଚ୍ଛ ହସ୍ପିଟାଲ ମୂଲ୍ୟାଙ୍କନ',
    '⌂ Home': '⌂ ହୋମ୍',
    'Cover page': 'କଭର୍ ପୃଷ୍ଠା',

    /* tabs / toolbar */
    '1. Assessment Checklist': '1. ମୂଲ୍ୟାଙ୍କନ ଚେକ୍‌ଲିଷ୍ଟ',
    '2. General Details / Hospital Score Card': '2. ସାଧାରଣ ବିବରଣୀ / ହସ୍ପିଟାଲ୍ ସ୍କୋର କାର୍ଡ',
    '3. NQAS Upload Repository': '3. NQAS ଅପଲୋଡ୍ ଭଣ୍ଡାର',
    'Open General Details / Hospital Score Card': 'ସାଧାରଣ ବିବରଣୀ / ହସ୍ପିଟାଲ୍ ସ୍କୋର କାର୍ଡ ଖୋଲନ୍ତୁ',
    'Open NQAS Upload Repository': 'NQAS ଅପଲୋଡ୍ ଭଣ୍ଡାର ଖୋଲନ୍ତୁ',
    'Reset facility answers': 'କେନ୍ଦ୍ରର ଉତ୍ତର ରିସେଟ୍ କରନ୍ତୁ',
    'Reset answers': 'ଉତ୍ତର ରିସେଟ୍ କରନ୍ତୁ',
    'Download Blank Checklist': 'ଖାଲି ଚେକ୍‌ଲିଷ୍ଟ ଡାଉନଲୋଡ୍',
    'Download Filled Checklist': 'ଭରାଯାଇଥିବା ଚେକ୍‌ଲିଷ୍ଟ ଡାଉନଲୋଡ୍',
    'Download Blank': 'ଖାଲି ଡାଉନଲୋଡ୍',
    'Download Filled': 'ଭରାଯାଇଥିବା ଡାଉନଲୋଡ୍',
    'Upload External XLSX': 'ବାହ୍ୟ XLSX ଅପଲୋଡ୍ କରନ୍ତୁ',
    'Upload filled XLSX': 'ଭରାଯାଇଥିବା XLSX ଅପଲୋଡ୍',
    'Saved assessments': 'ସଞ୍ଚିତ ମୂଲ୍ୟାଙ୍କନ',
    'Saved Kayakalp assessments': 'ସଞ୍ଚିତ କାୟାକଳ୍ପ ମୂଲ୍ୟାଙ୍କନ',

    /* general-details bar */
    'State': 'ରାଜ୍ୟ',
    'District': 'ଜିଲ୍ଲା',
    'Block / Urban Area': 'ବ୍ଲକ୍ / ସହରାଞ୍ଚଳ',
    'Facility / Hospital Name': 'ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର / ହସ୍ପିଟାଲ୍ ନାମ',
    'Facility Type': 'ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ପ୍ରକାର',
    'Facility type': 'ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ପ୍ରକାର',
    'Facility type:': 'ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ପ୍ରକାର:',
    'Assessment Type': 'ମୂଲ୍ୟାଙ୍କନ ପ୍ରକାର',
    'Assessor 1': 'ମୂଲ୍ୟାଙ୍କକ 1',
    'Assessor 2': 'ମୂଲ୍ୟାଙ୍କକ 2',
    'Assessment Start Date': 'ମୂଲ୍ୟାଙ୍କନ ଆରମ୍ଭ ତାରିଖ',
    'Assessment End Date': 'ମୂଲ୍ୟାଙ୍କନ ସମାପ୍ତି ତାରିଖ',
    'Self': 'ସ୍ୱୟଂ',
    'Peer': 'ସହକର୍ମୀ',
    'Other': 'ଅନ୍ୟାନ୍ୟ',
    'Internal Assessment 1': 'ଆଭ୍ୟନ୍ତରୀଣ ମୂଲ୍ୟାଙ୍କନ 1',
    'Internal Assessment 2': 'ଆଭ୍ୟନ୍ତରୀଣ ମୂଲ୍ୟାଙ୍କନ 2',
    'Internal Assessment 3': 'ଆଭ୍ୟନ୍ତରୀଣ ମୂଲ୍ୟାଙ୍କନ 3',
    'District…': 'ଜିଲ୍ଲା…',
    'Block…': 'ବ୍ଲକ୍…',
    'Assessment type…': 'ମୂଲ୍ୟାଙ୍କନ ପ୍ରକାର…',
    'Select Facility Type': 'କେନ୍ଦ୍ର ପ୍ରକାର ବାଛନ୍ତୁ',
    'Select Kayakalp checklist…': 'କାୟାକଳ୍ପ ଚେକ୍‌ଲିଷ୍ଟ ବାଛନ୍ତୁ…',
    'Assessor 1 name': 'ମୂଲ୍ୟାଙ୍କକ 1 ଙ୍କ ନାମ',
    'Assessor 2 name': 'ମୂଲ୍ୟାଙ୍କକ 2 ଙ୍କ ନାମ',
    'Assessor 1 designation': 'ମୂଲ୍ୟାଙ୍କକ 1 ଙ୍କ ପଦବୀ',
    'Assessor 2 designation': 'ମୂଲ୍ୟାଙ୍କକ 2 ଙ୍କ ପଦବୀ',
    '💾 Save': '💾 ସେଭ୍ କରନ୍ତୁ',
    'Saving…': 'ସେଭ୍ ହେଉଛି…',
    '✔ Saved to cloud': '✔ କ୍ଲାଉଡ୍‌ରେ ସେଭ୍ ହେଲା',
    'Saved on this device. Sign in to also save to the cloud.': 'ଏହି ଡିଭାଇସ୍‌ରେ ସେଭ୍ ହେଲା। କ୍ଲାଉଡ୍‌ରେ ସେଭ୍ ପାଇଁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ।',
    'Saved on this device. Select the facility to save to the cloud.': 'ଏହି ଡିଭାଇସ୍‌ରେ ସେଭ୍ ହେଲା। କ୍ଲାଉଡ୍‌ରେ ସେଭ୍ ପାଇଁ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ବାଛନ୍ତୁ।',
    'Saved on this device. Cloud save failed – will retry.': 'ଏହି ଡିଭାଇସ୍‌ରେ ସେଭ୍ ହେଲା। କ୍ଲାଉଡ୍ ସେଭ୍ ବିଫଳ – ପୁନର୍ବାର ଚେଷ୍ଟା ହେବ।',
    'Saved on this device. Session expired – tap ☁ to sign in.': 'ଏହି ଡିଭାଇସ୍‌ରେ ସେଭ୍ ହେଲା। ସେସନ୍ ସମାପ୍ତ – ସାଇନ୍ ଇନ୍ ପାଇଁ ☁ ଦବାନ୍ତୁ।',
    'Select a facility type first': 'ପ୍ରଥମେ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରର ପ୍ରକାର ବାଛନ୍ତୁ',
    'Select a Kayakalp checklist first': 'ପ୍ରଥମେ କାୟାକଳ୍ପ ଚେକ୍‌ଲିଷ୍ଟ ବାଛନ୍ତୁ',
    'Enter facility name': 'କେନ୍ଦ୍ରର ନାମ ଲେଖନ୍ତୁ',
    'Facility / Sub-centre… (type to search)': 'ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର / ଉପକେନ୍ଦ୍ର… (ଖୋଜିବାକୁ ଟାଇପ୍ କରନ୍ତୁ)',
    'General remarks': 'ସାଧାରଣ ମନ୍ତବ୍ୟ',
    'Enter PSS %': 'PSS % ଲେଖନ୍ତୁ',
    'Start date': 'ଆରମ୍ଭ ତାରିଖ',
    'End date': 'ସମାପ୍ତି ତାରିଖ',
    'Please select a Facility Type to begin the assessment.': 'ମୂଲ୍ୟାଙ୍କନ ଆରମ୍ଭ କରିବାକୁ ଦୟାକରି କେନ୍ଦ୍ର ପ୍ରକାର ବାଛନ୍ତୁ।',

    /* checkpoint card */
    'Assessment Method:': 'ମୂଲ୍ୟାଙ୍କନ ପଦ୍ଧତି:',
    'Means of Verification (MOV):': 'ଯାଞ୍ଚ ମାଧ୍ୟମ (MOV):',
    'Means of verification': 'ଯାଞ୍ଚ ମାଧ୍ୟମ',
    'Remarks:': 'ମନ୍ତବ୍ୟ:',
    'Remarks': 'ମନ୍ତବ୍ୟ',
    'Compliance': 'ଅନୁପାଳନ',
    'Not specified in checklist': 'ଚେକ୍‌ଲିଷ୍ଟରେ ଉଲ୍ଲେଖ ନାହିଁ',
    '0 - Non-Compliant': '0 - ଅନୁପାଳିତ ନୁହେଁ',
    '1 - Partially Compliant': '1 - ଆଂଶିକ ଅନୁପାଳିତ',
    '2 - Fully Compliant': '2 - ସମ୍ପୂର୍ଣ୍ଣ ଅନୁପାଳିତ',
    '0 · Non-compliant': '0 · ଅନୁପାଳିତ ନୁହେଁ',
    '1 · Partial': '1 · ଆଂଶିକ',
    '2 · Compliant': '2 · ଅନୁପାଳିତ',
    'Remarks / evidence (required for Non-Compliant / Partially Compliant)': 'ମନ୍ତବ୍ୟ / ପ୍ରମାଣ (ଅନୁପାଳିତ ନୁହେଁ / ଆଂଶିକ ଅନୁପାଳିତ ପାଇଁ ଆବଶ୍ୟକ)',
    'Orange badge on a checkpoint = Assessment Method —': 'ଚେକ୍‌ପଏଣ୍ଟରେ କମଳା ବ୍ୟାଜ୍ = ମୂଲ୍ୟାଙ୍କନ ପଦ୍ଧତି —',
    'Observation,': 'ପର୍ଯ୍ୟବେକ୍ଷଣ,',
    'Staff Interview,': 'କର୍ମଚାରୀ ସାକ୍ଷାତ୍କାର,',
    'Patient Interview,': 'ରୋଗୀ ସାକ୍ଷାତ୍କାର,',
    'Record Review.': 'ରେକର୍ଡ ସମୀକ୍ଷା।',
    'and': 'ଏବଂ',
    'Uses the district / block / facility / assessment details selected in the bar above. Scoring: 0 Non-compliant · 1 Partial · 2 Compliant. Method: OB Observation · SI Staff Interview · PI Patient Interview · RR Record Review.':
      'ଉପର ବାରରେ ବଛାଯାଇଥିବା ଜିଲ୍ଲା / ବ୍ଲକ୍ / କେନ୍ଦ୍ର / ମୂଲ୍ୟାଙ୍କନ ବିବରଣୀ ବ୍ୟବହୃତ ହୁଏ। ସ୍କୋରିଂ: 0 ଅନୁପାଳିତ ନୁହେଁ · 1 ଆଂଶିକ · 2 ଅନୁପାଳିତ। ପଦ୍ଧତି: OB ପର୍ଯ୍ୟବେକ୍ଷଣ · SI କର୍ମଚାରୀ ସାକ୍ଷାତ୍କାର · PI ରୋଗୀ ସାକ୍ଷାତ୍କାର · RR ରେକର୍ଡ ସମୀକ୍ଷା।',

    /* score card & declaration */
    'Score Card': 'ସ୍କୋର କାର୍ଡ',
    'Kayakalp Score Card': 'କାୟାକଳ୍ପ ସ୍କୋର କାର୍ଡ',
    'Hospital Score Card': 'ହସ୍ପିଟାଲ୍ ସ୍କୋର କାର୍ଡ',
    'General Details / Hospital Score Sheet': 'ସାଧାରଣ ବିବରଣୀ / ହସ୍ପିଟାଲ୍ ସ୍କୋର ସିଟ୍',
    'General details': 'ସାଧାରଣ ବିବରଣୀ',
    'Executive Summary / Result': 'କାର୍ଯ୍ୟନିର୍ବାହୀ ସାରାଂଶ / ଫଳାଫଳ',
    'Current Facility': 'ବର୍ତ୍ତମାନର କେନ୍ଦ୍ର',
    'Area of Concern': 'ଚିନ୍ତା କ୍ଷେତ୍ର (Area of Concern)',
    'Area of Concern Wise Score': 'ଚିନ୍ତା କ୍ଷେତ୍ର ଅନୁସାରେ ସ୍କୋର',
    'Area of Concern wise Score': 'ଚିନ୍ତା କ୍ଷେତ୍ର ଅନୁସାରେ ସ୍କୋର',
    'Area of Concern & Standards for PHC': 'PHC ପାଇଁ ଚିନ୍ତା କ୍ଷେତ୍ର ଓ ମାନକ',
    'Department / Service Wise Score': 'ବିଭାଗ / ସେବା ଅନୁସାରେ ସ୍କୋର',
    'Standards wise Score': 'ମାନକ ଅନୁସାରେ ସ୍କୋର',
    'Theme Wise Score': 'ଥିମ୍ ଅନୁସାରେ ସ୍କୋର',
    'Department Score': 'ବିଭାଗ ସ୍କୋର',
    'Aggregate Score': 'ସମୁଦାୟ ସ୍କୋର',
    'Critical Standards': 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ମାନକ',
    'Patient Satisfaction Score': 'ରୋଗୀ ସନ୍ତୁଷ୍ଟି ସ୍କୋର',
    'Patient Satisfaction Score (%)': 'ରୋଗୀ ସନ୍ତୁଷ୍ଟି ସ୍କୋର (%)',
    'Enter Patient Satisfaction Score (%)': 'ରୋଗୀ ସନ୍ତୁଷ୍ଟି ସ୍କୋର (%) ଲେଖନ୍ତୁ',
    'Declaration of Result': 'ଫଳାଫଳ ଘୋଷଣା',
    'Score Awarded (out of 10)': 'ପ୍ରଦତ୍ତ ସ୍କୋର (10 ମଧ୍ୟରୁ)',
    'Points (out of 10)': 'ପଏଣ୍ଟ (10 ମଧ୍ୟରୁ)',
    'Score Obtained': 'ପ୍ରାପ୍ତ ସ୍କୋର',
    'Maximum Score': 'ସର୍ବାଧିକ ସ୍କୋର',
    'Percentage': 'ପ୍ରତିଶତ',
    'Score': 'ସ୍କୋର',
    'Score (%)': 'ସ୍କୋର (%)',
    'Marks': 'ନମ୍ବର',
    'Total': 'ମୋଟ',
    'TOTAL SCORE': 'ମୋଟ ସ୍କୋର',
    'Overall Score': 'ସାମଗ୍ରିକ ସ୍କୋର',
    'Result': 'ଫଳାଫଳ',
    'PASS': 'ଉତ୍ତୀର୍ଣ୍ଣ',
    'NOT ASSESSED': 'ମୂଲ୍ୟାଙ୍କନ ହୋଇନାହିଁ',
    'ELIGIBLE FOR CERTIFICATION': 'ପ୍ରମାଣପତ୍ର ପାଇଁ ଯୋଗ୍ୟ',
    'NOT ELIGIBLE': 'ଯୋଗ୍ୟ ନୁହେଁ',
    'Not met': 'ପୂରଣ ହୋଇନାହିଁ',
    'Not scored': 'ସ୍କୋର ହୋଇନାହିଁ',
    'Assessed': 'ମୂଲ୍ୟାଙ୍କିତ',
    'Checkpoints Assessed': 'ମୂଲ୍ୟାଙ୍କିତ ଚେକ୍‌ପଏଣ୍ଟ',
    'Criteria': 'ମାନଦଣ୍ଡ',
    'Criteria No.': 'ମାନଦଣ୍ଡ ନଂ.',
    'Department': 'ବିଭାଗ',
    'Standard': 'ମାନକ',
    'Category': 'ବର୍ଗ',
    'Theme': 'ଥିମ୍',
    'Checklist': 'ଚେକ୍‌ଲିଷ୍ଟ',
    'Facility': 'ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର',
    'Assessment': 'ମୂଲ୍ୟାଙ୍କନ',
    'District / Block': 'ଜିଲ୍ଲା / ବ୍ଲକ୍',
    'Remarks / Doubts': 'ମନ୍ତବ୍ୟ / ସନ୍ଦେହ',
    'Thematic scores': 'ଥିମ୍ ଅନୁସାରେ ସ୍କୋର',
    'WASH score': 'WASH ସ୍କୋର',
    'WASH theme': 'WASH ଥିମ୍',
    'Eligibility check': 'ଯୋଗ୍ୟତା ଯାଞ୍ଚ',
    'Threshold % (editable; not part of the workbook)': 'ସୀମା % (ସମ୍ପାଦନଯୋଗ୍ୟ; ୱାର୍କବୁକ୍‌ର ଅଂଶ ନୁହେଁ)',
    'Category-wise score': 'ବର୍ଗ ଅନୁସାରେ ସ୍କୋର',
    'None recorded.': 'କିଛି ରେକର୍ଡ ହୋଇନାହିଁ।',
    'incomplete; unanswered checkpoints count as 0': 'ଅସମ୍ପୂର୍ଣ୍ଣ; ଉତ୍ତରହୀନ ଚେକ୍‌ପଏଣ୍ଟ 0 ଗଣାଯାଏ',
    'Select a Kayakalp checklist above to begin.': 'ଆରମ୍ଭ କରିବାକୁ ଉପରୁ ଏକ କାୟାକଳ୍ପ ଚେକ୍‌ଲିଷ୍ଟ ବାଛନ୍ତୁ।',
    'Select a checklist first.': 'ପ୍ରଥମେ ଏକ ଚେକ୍‌ଲିଷ୍ଟ ବାଛନ୍ତୁ।',
    'Complete all required scores and the Patient Satisfaction Score to declare the result.': 'ଫଳାଫଳ ଘୋଷଣା ପାଇଁ ସମସ୍ତ ଆବଶ୍ୟକ ସ୍କୋର ଓ ରୋଗୀ ସନ୍ତୁଷ୍ଟି ସ୍କୋର ପୂରଣ କରନ୍ତୁ।',
    'or the corresponding Likert score specified in the declaration criteria.': 'ଅଥବା ଘୋଷଣା ମାନଦଣ୍ଡରେ ଉଲ୍ଲିଖିତ ସଂଶ୍ଳିଷ୍ଟ ଲାଇକର୍ଟ ସ୍କୋର।',
    'Built from NQAS XLSForm checklist data (UPHC, CHC, PHC, AAM-SHC). Scores are indicative — refer to the official NQAS assessor toolkit for authoritative scoring.':
      'NQAS XLSForm ଚେକ୍‌ଲିଷ୍ଟ ତଥ୍ୟ (UPHC, CHC, PHC, AAM-SHC) ଆଧାରରେ ପ୍ରସ୍ତୁତ। ସ୍କୋର ସୂଚକ ମାତ୍ର — ପ୍ରାମାଣିକ ସ୍କୋରିଂ ପାଇଁ ଅଧିକାରିକ NQAS ମୂଲ୍ୟାଙ୍କକ ଟୁଲକିଟ୍ ଦେଖନ୍ତୁ।',
    'No checkpoint remarks have been entered yet.': 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଚେକ୍‌ପଏଣ୍ଟ ମନ୍ତବ୍ୟ ଲେଖାଯାଇନାହିଁ।',
    'No checkpoint remarks have been entered yet. Remarks entered on Page 1 will appear here automatically.': 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଚେକ୍‌ପଏଣ୍ଟ ମନ୍ତବ୍ୟ ଲେଖାଯାଇନାହିଁ। ପୃଷ୍ଠା 1 ରେ ଲେଖାଯାଇଥିବା ମନ୍ତବ୍ୟ ଏଠାରେ ସ୍ୱୟଂଚାଳିତ ଭାବେ ଦେଖାଯିବ।',
    'The declaration follows the certification criteria shown in the provided reference image. Criteria that cannot be evaluated because required scores or inputs are unavailable are shown as':
      'ଘୋଷଣା ପ୍ରଦତ୍ତ ରେଫରେନ୍ସ ଚିତ୍ରରେ ଦର୍ଶାଯାଇଥିବା ପ୍ରମାଣପତ୍ର ମାନଦଣ୍ଡ ଅନୁସରଣ କରେ। ଆବଶ୍ୟକ ସ୍କୋର ବା ତଥ୍ୟ ଉପଲବ୍ଧ ନଥିବାରୁ ଯେଉଁ ମାନଦଣ୍ଡ ମୂଲ୍ୟାଙ୍କନ ହୋଇପାରୁନି, ତାହା ଦର୍ଶାଯାଏ:',

    /* certification criteria text (official wording is also in English via the criteria table itself) */
    'Individual Quality Score for all selected Department ≥ 70%': 'ସମସ୍ତ ବଛାଯାଇଥିବା ବିଭାଗର ବ୍ୟକ୍ତିଗତ ଗୁଣବତ୍ତା ସ୍କୋର ≥ 70%',
    'Score of Each Service Package (Minimum 7 packages) ≥ 70%': 'ପ୍ରତ୍ୟେକ ସେବା ପ୍ୟାକେଜ୍‌ର ସ୍କୋର (ସର୍ବନିମ୍ନ 7 ପ୍ୟାକେଜ୍) ≥ 70%',
    'Aggregate score ≥ 70%': 'ସମୁଦାୟ ସ୍କୋର ≥ 70%',
    'Individual Quality Score of all 8 area of concern ≥ 70%': 'ସମସ୍ତ 8 ଚିନ୍ତା କ୍ଷେତ୍ରର ବ୍ୟକ୍ତିଗତ ଗୁଣବତ୍ତା ସ୍କୋର ≥ 70%',
    'Individual Quality Score of all 8 area of concern ≥ 60%': 'ସମସ୍ତ 8 ଚିନ୍ତା କ୍ଷେତ୍ରର ବ୍ୟକ୍ତିଗତ ଗୁଣବତ୍ତା ସ୍କୋର ≥ 60%',
    'Individual Standard wise score ≥ 50%': 'ପ୍ରତ୍ୟେକ ମାନକର ସ୍କୋର ≥ 50%',
    'Standard A2, B5 and D10 ≥ 70%': 'ମାନକ A2, B5 ଓ D10 ≥ 70%',
    'Standard A2, B5 and D8 ≥ 60%': 'ମାନକ A2, B5 ଓ D8 ≥ 60%',
    'Standard A2, B4 and F6 ≥ 60%': 'ମାନକ A2, B4 ଓ F6 ≥ 60%',
    'Standard A1, D3, D4, D5, G2 ≥ 60%': 'ମାନକ A1, D3, D4, D5, G2 ≥ 60%',
    '≥ 70% in the preceding Quarter or more': 'ପୂର୍ବବର୍ତ୍ତୀ ତ୍ରୈମାସିକରେ ≥ 70% ବା ଅଧିକ',
    '65% in the preceding Quarter or more': 'ପୂର୍ବବର୍ତ୍ତୀ ତ୍ରୈମାସିକରେ 65% ବା ଅଧିକ',
    '60% in the preceding Quarter or more': 'ପୂର୍ବବର୍ତ୍ତୀ ତ୍ରୈମାସିକରେ 60% ବା ଅଧିକ',
    '< 60% in the preceding Quarter': 'ପୂର୍ବବର୍ତ୍ତୀ ତ୍ରୈମାସିକରେ < 60%',
    'PSS ≥70% in the preceding Quarter or more (Satisfied & Highly Satisfied on Mera-Aspataal) or Score of 3.5 on Likert Scale': 'PSS ≥70% ପୂର୍ବବର୍ତ୍ତୀ ତ୍ରୈମାସିକରେ ବା ଅଧିକ (ମେରା-ଅସ୍ପତାଲରେ ସନ୍ତୁଷ୍ଟ ଓ ଅତ୍ୟନ୍ତ ସନ୍ତୁଷ୍ଟ) ଅଥବା ଲାଇକର୍ଟ ସ୍କେଲ୍‌ରେ 3.5 ସ୍କୋର',
    'PSS ≥65% in the preceding Quarter or more (Satisfied & Highly Satisfied on Mera-Aspataal) or Score of 3.2 on Likert Scale': 'PSS ≥65% ପୂର୍ବବର୍ତ୍ତୀ ତ୍ରୈମାସିକରେ ବା ଅଧିକ (ମେରା-ଅସ୍ପତାଲରେ ସନ୍ତୁଷ୍ଟ ଓ ଅତ୍ୟନ୍ତ ସନ୍ତୁଷ୍ଟ) ଅଥବା ଲାଇକର୍ଟ ସ୍କେଲ୍‌ରେ 3.2 ସ୍କୋର',
    'PSS ≥60% in the preceding Quarter or more (Satisfied & Highly Satisfied on Mera-Aspataal) or Score of 3.0 on Likert Scale': 'PSS ≥60% ପୂର୍ବବର୍ତ୍ତୀ ତ୍ରୈମାସିକରେ ବା ଅଧିକ (ମେରା-ଅସ୍ପତାଲରେ ସନ୍ତୁଷ୍ଟ ଓ ଅତ୍ୟନ୍ତ ସନ୍ତୁଷ୍ଟ) ଅଥବା ଲାଇକର୍ଟ ସ୍କେଲ୍‌ରେ 3.0 ସ୍କୋର',
    'District Hospital': 'ଜିଲ୍ଲା ହସ୍ପିଟାଲ୍',

    /* Areas of concern & national-health-programme groups */
    'Service Provision': 'ସେବା ପ୍ରଦାନ',
    'Patient Rights': 'ରୋଗୀ ଅଧିକାର',
    "Patient's Right": 'ରୋଗୀର ଅଧିକାର',
    'Inputs': 'ଇନ୍‌ପୁଟ୍',
    'Input': 'ଇନ୍‌ପୁଟ୍',
    'Support Services': 'ସହାୟକ ସେବା',
    'Clinical Services': 'କ୍ଲିନିକାଲ୍ ସେବା',
    'Infection Control': 'ସଂକ୍ରମଣ ନିୟନ୍ତ୍ରଣ',
    'Hospital Infection Control': 'ହସ୍ପିଟାଲ୍ ସଂକ୍ରମଣ ନିୟନ୍ତ୍ରଣ',
    'Quality Mgmt': 'ଗୁଣବତ୍ତା ପରିଚାଳନା',
    'Quality Management': 'ଗୁଣବତ୍ତା ପରିଚାଳନା',
    'Outcome': 'ପରିଣାମ',
    'Care in pregnancy & Childbirth': 'ଗର୍ଭାବସ୍ଥା ଓ ପ୍ରସବ ସମୟର ଯତ୍ନ',
    'Neonatal & Infant Health Services': 'ନବଜାତ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
    'Childhood & adolescent Health Services': 'ଶୈଶବ ଓ କିଶୋର ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
    'Family Planning': 'ପରିବାର ନିୟୋଜନ',
    'Management of Communicable diseases': 'ସଂକ୍ରାମକ ରୋଗର ପରିଚାଳନା',
    'Management of Simple illness including Minor Elements': 'ସାଧାରଣ ଅସୁସ୍ଥତାର ପରିଚାଳନା (ଛୋଟ ସମସ୍ୟା ସମେତ)',
    'Management of Non Communicable Diseases': 'ଅସଂକ୍ରାମକ ରୋଗର ପରିଚାଳନା',
    'Care for Common Ophthalmic and ENT': 'ସାଧାରଣ ଚକ୍ଷୁ ଓ ENT ଯତ୍ନ',
    'Oral health care.': 'ମୁଖ ସ୍ୱାସ୍ଥ୍ୟ ଯତ୍ନ।',
    'Elderly and Palliative health care': 'ବୟସ୍କ ଓ ଉପଶମକାରୀ ସ୍ୱାସ୍ଥ୍ୟ ଯତ୍ନ',
    'Emergency Medical Services': 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା ସେବା',
    'Management of Mental health ailments.': 'ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟାର ପରିଚାଳନା।',
    'Drugs & Diagnostics': 'ଔଷଧ ଓ ଡାଇଗ୍ନୋଷ୍ଟିକ୍',
    'Water': 'ଜଳ',
    'Hygiene': 'ସ୍ୱଚ୍ଛତା',
    'Management': 'ପରିଚାଳନା',
    'Sanitation & Healthcare Waste': 'ପରିମଳ ଓ ସ୍ୱାସ୍ଥ୍ୟସେବା ବର୍ଜ୍ୟବସ୍ତୁ',
    'WASH · Water': 'WASH · ଜଳ',
    'WASH · Hygiene': 'WASH · ସ୍ୱଚ୍ଛତା',
    'WASH · Management': 'WASH · ପରିଚାଳନା',
    'WASH · Sanitation & Healthcare Waste': 'WASH · ପରିମଳ ଓ ସ୍ୱାସ୍ଥ୍ୟସେବା ବର୍ଜ୍ୟବସ୍ତୁ',

    /* upload repositories */
    'NQAS Upload Repository': 'NQAS ଅପଲୋଡ୍ ଭଣ୍ଡାର',
    'Kayakalp Upload Repository': 'କାୟାକଳ୍ପ ଅପଲୋଡ୍ ଭଣ୍ଡାର',
    'Upload Repository': 'ଅପଲୋଡ୍ ଭଣ୍ଡାର',
    'Upload XLSX from Computer': 'କମ୍ପ୍ୟୁଟରରୁ XLSX ଅପଲୋଡ୍ କରନ୍ତୁ',
    'Clear Selected Template': 'ବଛାଯାଇଥିବା ଟେମ୍ପଲେଟ୍ ସଫା କରନ୍ତୁ',
    'Download All Blank Checklists (ZIP)': 'ସମସ୍ତ ଖାଲି ଚେକ୍‌ଲିଷ୍ଟ ଡାଉନଲୋଡ୍ (ZIP)',
    'Use This Template': 'ଏହି ଟେମ୍ପଲେଟ୍ ବ୍ୟବହାର କରନ୍ତୁ',
    'Select': 'ବାଛନ୍ତୁ',
    'No repository template selected yet.': 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଟେମ୍ପଲେଟ୍ ବଛାଯାଇନାହିଁ।',
    'Select a checklist workbook to make it the active template for': 'ସକ୍ରିୟ ଟେମ୍ପଲେଟ୍ ଭାବେ ସେଟ୍ କରିବାକୁ ଏକ ଚେକ୍‌ଲିଷ୍ଟ ୱାର୍କବୁକ୍ ବାଛନ୍ତୁ:',
    ', or upload your own Kayakalp workbook from your computer. Uploaded workbooks keep their original layout and are matched automatically to the right checklist.':
      ', ଅଥବା ନିଜ କମ୍ପ୍ୟୁଟରରୁ ନିଜର କାୟାକଳ୍ପ ୱାର୍କବୁକ୍ ଅପଲୋଡ୍ କରନ୍ତୁ। ଅପଲୋଡ୍ ହୋଇଥିବା ୱାର୍କବୁକ୍ ନିଜର ମୂଳ ଲେଆଉଟ୍ ରଖେ ଓ ସଠିକ୍ ଚେକ୍‌ଲିଷ୍ଟ ସହ ସ୍ୱଚାଳିତ ଭାବେ ମେଳ ହୁଏ।',
    '. The original workbook structure and formatting are retained as far as ExcelJS supports. The SDH entry is a DH-style adapted template; it is not presented as a separate NHSRC-issued SDH workbook.':
      '। ExcelJS ଯେତିକି ସମର୍ଥନ କରେ, ମୂଳ ୱାର୍କବୁକ୍‌ର ଗଠନ ଓ ଫର୍ମାଟିଂ ସେତିକି ବଜାୟ ରହେ। SDH ଏଣ୍ଟ୍ରି ଏକ DH-ଶୈଳୀର ଅନୁକୂଳିତ ଟେମ୍ପଲେଟ୍; ଏହା NHSRC ଦ୍ୱାରା ଜାରି ପୃଥକ SDH ୱାର୍କବୁକ୍ ଭାବେ ଉପସ୍ଥାପିତ ନୁହେଁ।',
    'No repository template selected. Download Filled will use the built-in Kayakalp workbook for the checklist chosen above.': 'କୌଣସି ଟେମ୍ପଲେଟ୍ ବଛାଯାଇନାହିଁ। ଭରାଯାଇଥିବା ଡାଉନଲୋଡ୍ ଉପରେ ବଛାଯାଇଥିବା ଚେକ୍‌ଲିଷ୍ଟ ପାଇଁ ଅନ୍ତର୍ନିର୍ମିତ କାୟାକଳ୍ପ ୱାର୍କବୁକ୍ ବ୍ୟବହାର କରିବ।',
    'No repository template selected. Download Filled Checklist will use the standard generated workbook.': 'କୌଣସି ଟେମ୍ପଲେଟ୍ ବଛାଯାଇନାହିଁ। ଭରାଯାଇଥିବା ଚେକ୍‌ଲିଷ୍ଟ ଡାଉନଲୋଡ୍ ସାଧାରଣ ପ୍ରସ୍ତୁତ ୱାର୍କବୁକ୍ ବ୍ୟବହାର କରିବ।',

    /* app chrome: login, network, sync, update */
    'District / Block / Facility login': 'ଜିଲ୍ଲା / ବ୍ଲକ୍ / ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ଲଗଇନ୍',
    'Facility (optional)': 'ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (ଇଚ୍ଛାଧୀନ)',
    'Block login (all facilities)': 'ବ୍ଲକ୍ ଲଗଇନ୍ (ସମସ୍ତ କେନ୍ଦ୍ର)',
    'Block (optional)': 'ବ୍ଲକ୍ (ଇଚ୍ଛାଧୀନ)',
    'District login (all blocks)': 'ଜିଲ୍ଲା ଲଗଇନ୍ (ସମସ୍ତ ବ୍ଲକ୍)',
    'Select district…': 'ଜିଲ୍ଲା ବାଛନ୍ତୁ…',
    'State Admin': 'ରାଜ୍ୟ ଆଡମିନ୍',
    'State admin': 'ରାଜ୍ୟ ଆଡମିନ୍',
    'Password': 'ପାସୱାର୍ଡ',
    'Sign in': 'ସାଇନ୍ ଇନ୍',
    'Sign out': 'ସାଇନ୍ ଆଉଟ୍',
    '⏻ Sign out': '⏻ ସାଇନ୍ ଆଉଟ୍',
    'Show password': 'ପାସୱାର୍ଡ ଦେଖାନ୍ତୁ',
    'Hide password': 'ପାସୱାର୍ଡ ଲୁଚାନ୍ତୁ',
    'Show / hide password': 'ପାସୱାର୍ଡ ଦେଖାନ୍ତୁ / ଲୁଚାନ୍ତୁ',
    'Continue offline (no cloud sync)': 'ଅଫଲାଇନ୍ ଜାରି ରଖନ୍ତୁ (କ୍ଲାଉଡ୍ ସିଙ୍କ୍ ନାହିଁ)',
    'Choose district and enter password.': 'ଜିଲ୍ଲା ବାଛନ୍ତୁ ଓ ପାସୱାର୍ଡ ଦିଅନ୍ତୁ।',
    'Signing in…': 'ସାଇନ୍ ଇନ୍ ହେଉଛି…',
    'Cannot reach server. Check internet and the API URL.': 'ସର୍ଭର୍ ସହ ସଂଯୋଗ ହେଉନାହିଁ। ଇଣ୍ଟରନେଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ।',
    'Online': 'ଅନଲାଇନ୍',
    'Offline': 'ଅଫଲାଇନ୍',
    'Install app': 'ଆପ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ',
    '○ Select facility to sync': '○ ସିଙ୍କ୍ ପାଇଁ କେନ୍ଦ୍ର ବାଛନ୍ତୁ',
    'Offline mode – sign in to sync': 'ଅଫଲାଇନ୍ ମୋଡ୍ – ସିଙ୍କ୍ ପାଇଁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
    '↻ Syncing…': '↻ ସିଙ୍କ୍ ହେଉଛି…',
    '● Synced': '● ସିଙ୍କ୍ ହୋଇଛି',
    '⚠ Offline – will retry': '⚠ ଅଫଲାଇନ୍ – ପୁନଃଚେଷ୍ଟା ହେବ',
    '⚠ Offline': '⚠ ଅଫଲାଇନ୍',
    'Session expired – tap ☁ to sign in': 'ସେସନ୍ ଶେଷ – ସାଇନ୍ ଇନ୍ ପାଇଁ ☁ ଦବାନ୍ତୁ',
    '🔒 Session expired – tap to sign in': '🔒 ସେସନ୍ ଶେଷ – ସାଇନ୍ ଇନ୍ ପାଇଁ ଦବାନ୍ତୁ',
    'No connection – changes are saved on this device and sync when back online': 'ସଂଯୋଗ ନାହିଁ – ପରିବର୍ତ୍ତନ ଏହି ଡିଭାଇସ୍‌ରେ ସଞ୍ଚିତ ହୁଏ ଓ ଅନଲାଇନ୍ ହେଲେ ସିଙ୍କ୍ ହେବ',
    'Connected': 'ସଂଯୁକ୍ତ',
    'Update': 'ଅପଡେଟ୍',
    'Later': 'ପରେ',
    'Downloading update…': 'ଅପଡେଟ୍ ଡାଉନଲୋଡ୍ ହେଉଛି…',
    'Keep the app open': 'ଆପ୍ ଖୋଲା ରଖନ୍ତୁ',
    'Update available': 'ଅପଡେଟ୍ ଉପଲବ୍ଧ',
    'A new version is ready to install.': 'ଏକ ନୂଆ ସଂସ୍କରଣ ଇନଷ୍ଟଲ୍ ପାଇଁ ପ୍ରସ୍ତୁତ।',
    'Installing update…': 'ଅପଡେଟ୍ ଇନଷ୍ଟଲ୍ ହେଉଛି…',
    'The app will restart on its own.': 'ଆପ୍ ନିଜେ ପୁନଃଆରମ୍ଭ ହେବ।',
    '✔ Updated to the latest version': '✔ ସର୍ବଶେଷ ସଂସ୍କରଣକୁ ଅପଡେଟ୍ ହୋଇଛି',
    'Install on iPhone / iPad': 'iPhone / iPad ରେ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ',
    'Install this app': 'ଏହି ଆପ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ',

    /* alerts / confirms */
    'Sign out? Unsynced changes stay on this device and upload next time you sign in.': 'ସାଇନ୍ ଆଉଟ୍ କରିବେ? ସିଙ୍କ୍ ହୋଇନଥିବା ପରିବର୍ତ୍ତନ ଏହି ଡିଭାଇସ୍‌ରେ ରହିବ ଓ ପରବର୍ତ୍ତୀ ସାଇନ୍ ଇନ୍‌ରେ ଅପଲୋଡ୍ ହେବ।',
    'Clear all Kayakalp answers for this checklist and facility?': 'ଏହି ଚେକ୍‌ଲିଷ୍ଟ ଓ କେନ୍ଦ୍ର ପାଇଁ ସମସ୍ତ କାୟାକଳ୍ପ ଉତ୍ତର ସଫା କରିବେ?',
    'Select a Kayakalp checklist first.': 'ପ୍ରଥମେ ଏକ କାୟାକଳ୍ପ ଚେକ୍‌ଲିଷ୍ଟ ବାଛନ୍ତୁ।',
    'Preparing ZIP...': 'ZIP ପ୍ରସ୍ତୁତ ହେଉଛି...',
    'Please select a Facility Type before downloading the XLSX.': 'XLSX ଡାଉନଲୋଡ୍ ପୂର୍ବରୁ ଦୟାକରି କେନ୍ଦ୍ର ପ୍ରକାର ବାଛନ୍ତୁ।',
    'Could not read this XLSX file. Please select a valid .xlsx workbook.': 'ଏହି XLSX ଫାଇଲ୍ ପଢ଼ାଯାଇପାରିଲା ନାହିଁ। ଦୟାକରି ଏକ ବୈଧ .xlsx ୱାର୍କବୁକ୍ ବାଛନ୍ତୁ।',
    'This file does not match any Kayakalp checklist layout.': 'ଏହି ଫାଇଲ୍ କୌଣସି କାୟାକଳ୍ପ ଚେକ୍‌ଲିଷ୍ଟ ଲେଆଉଟ୍ ସହ ମେଳ ଖାଉନାହିଁ।',
    'Could not generate the ZIP of blank checklists.': 'ଖାଲି ଚେକ୍‌ଲିଷ୍ଟର ZIP ପ୍ରସ୍ତୁତ କରାଯାଇପାରିଲା ନାହିଁ।',
    'Nothing saved yet.': 'ଏପର୍ଯ୍ୟନ୍ତ କିଛି ସଞ୍ଚିତ ହୋଇନାହିଁ।'
  };

  /* ---------------------------------------------------------------- patterns (numbers / interpolation) */
  function T(s) { return tr(s); }
  var PATTERNS = [
    [/^\((\d+) checkpoints?\)$/, function (m) { return '(' + m[1] + ' ଟି ଚେକ୍‌ପଏଣ୍ଟ)'; }],
    [/^of (\d+)$/, function (m) { return m[1] + ' ମଧ୍ୟରୁ'; }],
    [/^Max: (\d+(?:\.\d+)?)$/, function (m) { return 'ସର୍ବାଧିକ: ' + m[1]; }],
    [/^(\d+)\/(\d+) · (\d+)\/(\d+) done$/, function (m) { return m[1] + '/' + m[2] + ' · ' + m[3] + '/' + m[4] + ' ସମାପ୍ତ'; }],
    [/^(\d+)\/(\d+) · (\d+) assessed$/, function (m) { return m[1] + '/' + m[2] + ' · ' + m[3] + ' ମୂଲ୍ୟାଙ୍କିତ'; }],
    [/^([\d.]+) \/ ([\d.]+) marks · (\d+) of (\d+) checkpoints answered · (.+)$/, function (m) { return m[1] + ' / ' + m[2] + ' ନମ୍ବର · ' + m[4] + ' ମଧ୍ୟରୁ ' + m[3] + ' ଚେକ୍‌ପଏଣ୍ଟର ଉତ୍ତର ଦିଆଯାଇଛି · ' + m[5]; }],
    [/^([\d.]+) \/ ([\d.]+) · (\d+)\/(\d+) answered( —)?$/, function (m) { return m[1] + ' / ' + m[2] + ' · ' + m[3] + '/' + m[4] + ' ଉତ୍ତରିତ' + (m[5] ? ' —' : ''); }],
    [/^Achieved (\d+) of (\d+) marks$/, function (m) { return m[2] + ' ମଧ୍ୟରୁ ' + m[1] + ' ନମ୍ବର ପ୍ରାପ୍ତ'; }],
    [/^(.+) \((\d+) checkpoints\)$/, function (m) { return T(m[1]) + ' (' + m[2] + ' ଟି ଚେକ୍‌ପଏଣ୍ଟ)'; }],
    [/^(.+) Score Card$/, function (m) { return T(m[1]) + ' ସ୍କୋର କାର୍ଡ'; }],
    [/^(.+?) — (\d+) \/ (\d+) checkpoints scored$/, function (m) { return T(m[1]) + ' — ' + m[3] + ' ମଧ୍ୟରୁ ' + m[2] + ' ଚେକ୍‌ପଏଣ୍ଟ ସ୍କୋର ହୋଇଛି'; }],
    [/^Gaps — checkpoints scored below maximum \((\d+)\)$/, function (m) { return 'ଫାଙ୍କ — ସର୍ବାଧିକରୁ କମ୍ ସ୍କୋର ହୋଇଥିବା ଚେକ୍‌ପଏଣ୍ଟ (' + m[1] + ')'; }],
    [/^Declaration: (.+)$/, function (m) { return 'ଘୋଷଣା: ' + T(m[1]); }],
    [/^([A-H]) — (.+)$/, function (m) { return m[1] + ' — ' + T(m[2]); }],
    [/^For (.+): qualifying PSS threshold is$/, function (m) { return T(m[1]) + ' ପାଇଁ: ଯୋଗ୍ୟତା PSS ସୀମା ହେଉଛି'; }],
    [/^Allowed date range: (.+) to (.+)$/, function (m) { return 'ଅନୁମୋଦିତ ତାରିଖ ସୀମା: ' + m[1] + ' ରୁ ' + m[2]; }],
    [/^Clear all saved answers for (.+)$/, function (m) { return m[1] + ' ପାଇଁ ସମସ୍ତ ସଞ୍ଚିତ ଉତ୍ତର ସଫା କରିବେ?'; }],
    [/^Score card refresh:\s*(.*)$/, function (m) { return 'ସ୍କୋର କାର୍ଡ ରିଫ୍ରେସ୍: ' + m[1]; }],
    [/^Repository refresh:\s*(.*)$/, function (m) { return 'ଭଣ୍ଡାର ରିଫ୍ରେସ୍: ' + m[1]; }]
  ];

  function tr(s) {
    if (s == null) return s;
    var t = String(s), k = t.trim();
    if (!k) return t;
    var hit = UI[k];
    if (hit === undefined) {
      for (var i = 0; i < PATTERNS.length; i++) {
        var m = PATTERNS[i][0].exec(k);
        if (m) { hit = PATTERNS[i][1](m); break; }
      }
    }
    if (hit === undefined) return t;
    var lead = t.match(/^\s*/)[0], trail = t.match(/\s*$/)[0];
    return lead + hit + trail;
  }

  /* ---------------------------------------------------------------- official checklist content (English -> Odia) */
  var CONTENT = Object.create(null), contentLoaded = false, contentCount = 0;
  function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* Odia rendering of an official English string, or '' if none has been supplied/approved yet. */
  function oriya(s) { return lang === 'or' ? (CONTENT[norm(s)] || '') : ''; }
  /* HTML snippet placed right after the English text. Empty in English mode or when untranslated. */
  function TC(s) { var o = oriya(s); return o ? '<span class="or-sub" lang="or">' + esc(o) + '</span>' : ''; }
  function loadContent() {
    if (contentLoaded || !window.fetch) return;
    contentLoaded = true;
    fetch('data/or-checklist.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.map) return;
      for (var k in j.map) CONTENT[norm(k)] = j.map[k];
      contentCount = Object.keys(CONTENT).length;
      if (lang === 'or') rerenderContent();
    }).catch(function () { /* offline & not cached yet: English only */ });
  }
  /* Re-run the app's own renderers so TC() output appears / disappears. */
  function rerenderContent() {
    try { window.dispatchEvent(new CustomEvent('qatcontent')); } catch (e) { }
  }

  /* ---------------------------------------------------------------- DOM translator */
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, CODE: 1, NOSCRIPT: 1 };
  /* Proper nouns / data the app reads back from the DOM — never touched. */
  var SKIP_SEL = '#metaDistrictSel,#metaBlockSel,#metaFacilityList,#metaFacilitySel,.no-i18n,.or-sub,#lgBar,[data-noi18n]';
  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  var nodeInfo = new WeakMap();   // text node -> {en, set}
  var attrInfo = new WeakMap();   // element   -> {attr: {en, set}}

  function skipEl(el) {
    if (!el || el.nodeType !== 1) return true;
    if (SKIP_TAGS[el.tagName]) return true;
    return !!(el.closest && el.closest(SKIP_SEL));
  }
  /* Score-card / summary tables: show official English + Odia on one line when a translation exists. */
  var INLINE_OK = 'table,.score-panel,.sum-wrap,#scorePanel', INLINE_NO = '.cp,.me,.std,.dept,.th,.cat,#kkListEl,#deptList,.or-sub,.kk-g,.kk-c';
  function inlineContent(en, p) {
    if (lang !== 'or' || !contentCount || !p.closest || !p.closest(INLINE_OK) || p.closest(INLINE_NO)) return en;
    var k = norm(en), o = CONTENT[k];
    if (!o) { var m = /^([A-Za-z]{1,3}\d*[.\s]*(?:·|-|—)?\s+)(.+)$/.exec(k); if (m) o = CONTENT[norm(m[2])]; }
    return o ? en + ' / ' + o : en;
  }
  function doText(n, toOr) {
    var p = n.parentNode; if (!p || skipEl(p)) return;
    if (p.tagName === 'OPTION') {   /* never change option text: <option>Self</option> has value === text. Use label. */
      var t = n.nodeValue, w = toOr ? tr(t) : t;
      if (w !== t) p.setAttribute('label', w); else if (p.hasAttribute('label') && p.getAttribute('label') !== t) p.removeAttribute('label');
      return;
    }
    var v = n.nodeValue, info = nodeInfo.get(n);
    if (info && v === info.set) { /* our own write */ }
    else { info = { en: v, set: v }; nodeInfo.set(n, info); }   // new / changed by the app => new English source
    var want = toOr ? tr(info.en) : info.en;
    if (toOr && want === info.en) want = inlineContent(info.en, p);
    if (want !== v) { info.set = want; n.nodeValue = want; } else info.set = v;
  }
  function doAttrs(el, toOr) {
    if (skipEl(el) || !el.getAttribute) return;
    var rec = attrInfo.get(el) || {};
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a); if (v == null) return;
      var r = rec[a];
      if (!(r && v === r.set)) { r = { en: v, set: v }; rec[a] = r; }
      var want = toOr ? tr(r.en) : r.en;
      if (want !== v) { r.set = want; el.setAttribute(a, want); } else r.set = v;
    });
    attrInfo.set(el, rec);
  }
  function walk(root, toOr) {
    if (!root) return;
    if (root.nodeType === 3) { doText(root, toOr); return; }
    if (root.nodeType !== 1 || skipEl(root)) return;
    doAttrs(root, toOr);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.nodeType === 1 && (SKIP_TAGS[n.tagName] || (n.matches && n.matches(SKIP_SEL))) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n, toOr); else doAttrs(n, toOr); }
  }

  var pending = new Set(), raf = 0, applying = false;
  function flush() {
    raf = 0; if (lang !== 'or') { pending.clear(); return; }
    applying = true;
    pending.forEach(function (n) { if (n.isConnected !== false) walk(n, true); });
    pending.clear(); applying = false;
  }
  var mo = new MutationObserver(function (list) {
    if (lang !== 'or' || applying) return;
    list.forEach(function (m) {
      if (m.type === 'childList') m.addedNodes.forEach(function (n) { pending.add(n); });
      else if (m.type === 'characterData') pending.add(m.target);
      else if (m.type === 'attributes') pending.add(m.target);
    });
    if (!raf) raf = requestAnimationFrame(flush);
  });
  function observe() {
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  /* ---------------------------------------------------------------- native dialogs */
  var _alert = window.alert, _confirm = window.confirm;
  window.alert = function (m) { return _alert.call(window, lang === 'or' ? tr(m) : m); };
  window.confirm = function (m) { return _confirm.call(window, lang === 'or' ? tr(m) : m); };

  /* ---------------------------------------------------------------- toggle UI */
  var CSS = '.or-sub{display:block;margin-top:3px;font-weight:500;font-size:.94em;line-height:1.55;color:#d9b8ff;opacity:.95}' +
    'html[lang=or] body,html[lang=or] button,html[lang=or] select,html[lang=or] input,html[lang=or] textarea{font-family:"Noto Sans Oriya","Noto Sans Odia","Oriya Sangam MN","Kalinga","Nirmala UI",Calibri,Arial,sans-serif}' +
    'html[lang=or] .or-sub,.or-sub{font-family:"Noto Sans Oriya","Noto Sans Odia","Oriya Sangam MN","Kalinga","Nirmala UI",sans-serif}' +
    '.qat-lg{position:relative;display:inline-flex;vertical-align:middle;margin-left:8px;cursor:pointer;user-select:none;-webkit-user-select:none}' +
    '.qat-lg button{display:inline-flex;align-items:center;gap:7px;border:1px solid #6b3a8f;border-radius:999px;background:#1d1030;color:#fff;font-weight:600;font-size:13px;font-family:Calibri,Arial,"Noto Sans Oriya","Noto Sans Odia","Oriya Sangam MN","Kalinga","Nirmala UI",sans-serif;padding:6px 14px;min-height:34px;cursor:pointer;white-space:nowrap;transition:background .2s}' +
    '.qat-lg button:hover{background:#2a1745}' +
    '.qat-lg svg{flex:none}' +
    '#cover .qat-lg{position:absolute;top:calc(12px + env(safe-area-inset-top));left:14px;z-index:5;margin:0}';
  /* single button: shows the language you would switch TO (English <-> ଓଡ଼ିଆ) */
  function paintToggles() {
    var label = lang === 'or' ? 'Switch to English' : 'ଓଡ଼ିଆକୁ ବଦଳାନ୍ତୁ';
    document.querySelectorAll('.qat-lg').forEach(function (g) {
      g.setAttribute('data-lang', lang); g.setAttribute('title', label);
      var b = g.querySelector('button'); if (b) b.setAttribute('aria-label', label);
      var s = g.querySelector('.qat-lg-t'); if (s) { s.textContent = lang === 'or' ? 'English' : 'ଓଡ଼ିଆ'; s.setAttribute('lang', lang === 'or' ? 'en' : 'or'); }
    });
  }
  var GLOBE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  function makeToggle() {
    var d = document.createElement('div'); d.className = 'qat-lg no-i18n'; d.setAttribute('role', 'group'); d.setAttribute('aria-label', 'Language');
    d.innerHTML = '<button type="button">' + GLOBE + '<span class="qat-lg-t"></span></button>';
    /* one tap flips to the other language */
    d.addEventListener('click', function () { setLang(lang === 'or' ? 'en' : 'or'); });
    return d;
  }
  function mountToggles() {
    var sl = document.getElementById('qatStL'), sw = document.getElementById('compSwitch');
    if (sl) { if (!sl.querySelector('.qat-lg')) sl.appendChild(makeToggle()); }
    else if (sw && !sw.parentNode.querySelector('.qat-lg')) sw.insertAdjacentElement('afterend', makeToggle());
    var cv = document.getElementById('cover');
    if (cv && !cv.querySelector('.qat-lg')) cv.appendChild(makeToggle());
    paintToggles();
  }

  /* ---------------------------------------------------------------- public API */
  function setLang(l) {
    l = l === 'or' ? 'or' : 'en';
    try { localStorage.setItem(KEY, l); } catch (e) { }
    if (l === lang && document.documentElement.lang === l) { paintToggles(); return; }
    lang = l;
    document.documentElement.lang = l;
    applying = true; walk(document.body, l === 'or'); applying = false;
    if (l === 'or') loadContent();
    paintToggles();
    rerenderContent();
    try { window.dispatchEvent(new CustomEvent('qatlang', { detail: l })); } catch (e) { }
  }

  window.QAT_I18N = { globe: GLOBE, tr: tr, TC: TC, oriya: oriya, set: setLang, get: function () { return lang; }, UI: UI, stats: function () { return { ui: Object.keys(UI).length, content: contentCount }; } };
  window.TC = TC;                // used by the checklist renderers in index.html
  window.LT = function (s) { return lang === 'or' ? tr(s) : s; };

  function boot() {
    var st = document.createElement('style'); st.id = 'i18n-css'; st.textContent = CSS; document.head.appendChild(st);
    mountToggles(); observe();
    document.documentElement.lang = lang;
    if (lang === 'or') { loadContent(); applying = true; walk(document.body, true); applying = false; }
    /* overlays (login, cover) are built after load — mount toggles again shortly */
    setTimeout(mountToggles, 300); setTimeout(mountToggles, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
