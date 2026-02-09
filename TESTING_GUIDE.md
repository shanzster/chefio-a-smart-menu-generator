# Testing Guide - Food Scanner with Console Logs

## ✅ Both Servers Running with Detailed Logging

### Backend Server (Port 3001) ✅
- Detailed request/response logging
- Clarifai API call tracking
- Error details with stack traces

### React App (Port 5175) ✅
- Frontend service initialization
- Image capture logging
- API call tracking
- Error handling with details

---

## 🧪 How to Test

### Step 1: Open Browser Console

1. Open http://localhost:5175/
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. Keep it open during testing

### Step 2: Open Backend Terminal

Keep the terminal running `npm start` in the `server` folder visible to see backend logs.

### Step 3: Test Food Scanner

1. **Login** with test account
2. **Go to Scanner** (2nd item in navigation)
3. **Start Camera**
4. **Point at food** (or any object)
5. **Click "Capture & Identify"**

---

## 📊 What You'll See

### Frontend Console (Browser):
```
🔧 [FRONTEND] Clarifai Service initialized
📍 [FRONTEND] Proxy URL: http://localhost:3001

📸 [SCANNER] Starting capture and identify...
🖼️ [SCANNER] Image captured from video
📐 [SCANNER] Canvas size: 640 x 480
🔄 [SCANNER] Converted to base64, length: 85432

🚀 [FRONTEND] Starting food recognition...
📊 [FRONTEND] Image base64 length: 85432
🌐 [FRONTEND] Calling proxy at: http://localhost:3001/api/recognize-food
📡 [FRONTEND] Proxy response status: 200
✅ [FRONTEND] Success! Received 5 food items
🎯 [FRONTEND] Results: ["Apple (95%)", "Orange (85%)", "Tomato (78%)"]
✨ [FRONTEND] Recognition complete!

✅ [SCANNER] Recognition successful!
📊 [SCANNER] Found 5 food items
🥇 [SCANNER] Top result: Apple (95%)
🔄 [SCANNER] Alternatives: ["Orange (85%)", "Tomato (78%)"]
✨ [SCANNER] Capture and identify complete
```

### Backend Terminal:
```
🔍 [BACKEND] Received food recognition request
📊 [BACKEND] Request body size: 85432 bytes
✅ [BACKEND] Image base64 received, length: 85432
🚀 [BACKEND] Calling Clarifai API...
📡 [BACKEND] Clarifai API response status: 200
✅ [BACKEND] Clarifai API success!
📋 [BACKEND] Raw concepts received: 20
🔝 [BACKEND] Top 3 concepts: ["apple (95%)", "orange (85%)", "tomato (78%)"]
✨ [BACKEND] Filtered results: 5 foods
🎯 [BACKEND] Returning: ["Apple (95%)", "Orange (85%)", "Tomato (78%)"]
✅ [BACKEND] Request completed successfully
```

---

## 🐛 Common Errors & Solutions

### Error 1: "Cannot connect to backend server"

**Frontend Console:**
```
💥 [SCANNER] Recognition error: Failed to fetch
🌐 [SCANNER] Network/connection error
```

**Solution:**
- Check backend server is running
- Verify it's on port 3001
- Restart backend: `cd server && npm start`

---

### Error 2: "CORS Error"

**Frontend Console:**
```
Access to fetch at 'http://localhost:3001/api/recognize-food' 
from origin 'http://localhost:5175' has been blocked by CORS policy
```

**Solution:**
- Restart backend server
- Clear browser cache
- Check CORS is enabled in `server/index.js`

---

### Error 3: "Clarifai API Error"

**Backend Terminal:**
```
❌ [BACKEND] Clarifai API Error: {
  "status": {
    "code": 11102,
    "description": "Invalid authentication token"
  }
}
```

**Solution:**
- Check PAT in `server/index.js`
- Verify PAT at: https://clarifai.com/settings/security
- Make sure PAT has correct permissions

---

### Error 4: "No food items recognized"

**Backend Terminal:**
```
📋 [BACKEND] Raw concepts received: 0
⚠️ [SCANNER] No food items recognized
```

**Solution:**
- Image quality too low
- Not pointing at food
- Try better lighting
- Point at recognizable food item

---

### Error 5: "Rate Limit Exceeded"

**Backend Terminal:**
```
❌ [BACKEND] Clarifai API Error: {
  "status": {
    "code": 10020,
    "description": "Rate limit exceeded"
  }
}
```

**Solution:**
- You've used 1,000 free operations
- Wait for monthly reset
- Upgrade Clarifai plan

---

## 🔍 Debugging Checklist

### Before Testing:
- [ ] Backend server running (port 3001)
- [ ] React app running (port 5175)
- [ ] Browser console open (F12)
- [ ] Backend terminal visible

### During Testing:
- [ ] Watch frontend console for logs
- [ ] Watch backend terminal for logs
- [ ] Check for error messages
- [ ] Note confidence scores

### If Error Occurs:
- [ ] Read error message carefully
- [ ] Check which component failed (frontend/backend)
- [ ] Look for specific error codes
- [ ] Try solutions from this guide

---

## 📸 Test Scenarios

### Scenario 1: Test with Apple
1. Point camera at apple
2. Capture
3. **Expected:** "Apple (90-100%)"
4. **Check logs:** Should show high confidence

### Scenario 2: Test with Chicken
1. Point camera at raw chicken
2. Capture
3. **Expected:** "Chicken (85-95%)"
4. **Check logs:** Should categorize as "Protein"

### Scenario 3: Test with Tomato
1. Point camera at tomato
2. Capture
3. **Expected:** "Tomato (85-95%)"
4. **Check logs:** Should categorize as "Vegetable"

### Scenario 4: Test with Non-Food
1. Point camera at phone/book
2. Capture
3. **Expected:** Low confidence or no results
4. **Check logs:** Should show fallback to mock data

---

## 📊 Log Levels

### Frontend Logs:
- 🔧 **Initialization** - Service setup
- 📸 **Capture** - Image capture events
- 🚀 **API Call** - Network requests
- ✅ **Success** - Successful operations
- 💥 **Error** - Error events

### Backend Logs:
- 🔍 **Request** - Incoming requests
- 🚀 **API Call** - Clarifai API calls
- 📡 **Response** - API responses
- ✅ **Success** - Successful operations
- ❌ **Error** - Error events

---

## 🎯 Success Indicators

### Everything Working:
✅ Frontend logs show successful API call
✅ Backend logs show Clarifai API success
✅ Food item identified with confidence score
✅ Alternative suggestions shown
✅ Toast notification appears
✅ No error messages

### Partial Success:
⚠️ API call succeeds but low confidence
⚠️ Fallback to mock data
⚠️ Some alternatives missing

### Failure:
❌ Network error
❌ API error
❌ No results returned
❌ Error toast shown

---

## 🚀 Next Steps After Testing

### If Working:
1. Test with multiple food items
2. Test complete workflow (Scan → Generate → Save)
3. Deploy to production

### If Not Working:
1. Copy error messages from console
2. Check backend terminal for errors
3. Follow troubleshooting guide
4. Restart both servers
5. Clear browser cache

---

## ✨ Summary

**Console Logs Added:**
- ✅ Frontend service initialization
- ✅ Image capture tracking
- ✅ API call logging
- ✅ Response tracking
- ✅ Error details with stack traces
- ✅ Backend request/response logging
- ✅ Clarifai API call tracking

**How to Test:**
1. Open browser console (F12)
2. Keep backend terminal visible
3. Test Scanner
4. Watch logs in both places
5. Identify any errors

**Both servers running with detailed logging!** 📊🔍
