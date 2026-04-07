-- EngineAI Automation Script
-- These functions run automatically at different points in the app.
-- Edit this file to customise the app behaviour.
-- Save and restart the app for changes to take effect.

-- Runs before every diagnosis is sent to the AI.
-- Use this to clean up or add context to the symptom text.
-- @param symptom string  the raw text the user typed
-- @param vehicle string  the vehicle from the profile
-- @return string         the modified symptom to send
function on_before_diagnose(symptom, vehicle)
  -- Remove extra whitespace
  symptom = symptom:gsub("%s+", " ")
  symptom = symptom:match("^%s*(.-)%s*$")

  -- Auto-add vehicle context if not already mentioned
  if vehicle ~= "" and not symptom:find(vehicle) then
    symptom = "[" .. vehicle .. "] " .. symptom
  end

  -- Expand common shorthand
  symptom = symptom:gsub("CEL", "check engine light")
  symptom = symptom:gsub("cel", "check engine light")
  symptom = symptom:gsub("RPM", "revs per minute")

  return symptom
end

-- Runs after every diagnosis is received from the AI.
-- Use this to tag, log or modify the response.
-- @param diagnosis string  the full AI response text
-- @param symptom   string  the original symptom
-- @return string           the modified diagnosis to display
function on_after_diagnose(diagnosis, symptom)
  -- Add a timestamp header to every diagnosis
  local timestamp = os.date("%d %b %Y %H:%M")
  diagnosis = "Diagnosed: " .. timestamp .. "\n\n" .. diagnosis
  return diagnosis
end

-- Runs when the app starts.
-- Use this to log startup info or set initial state.
-- @return string  a startup message (shown in console)
function on_startup()
  return "EngineAI automation loaded — " .. os.date("%d %b %Y")
end

-- Runs when the user changes their vehicle in the profile.
-- @param vehicle string  the new vehicle string
-- @return string         optional message to show the user
function on_vehicle_change(vehicle)
  if vehicle == "" then
    return "No vehicle set — diagnosis accuracy may be lower."
  end
  return "Vehicle set to: " .. vehicle
end
