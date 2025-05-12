// scripts/mainState.js

/**
 * @file Manages the shared state for the tooltip application.
 * This includes data fetched from the API, user interaction counts,
 * and references to key DOM elements created by the script.
 */

export const state = {
    questionMatrix: {},      // Stores tooltip content (key: field identifier, value: tooltip text)
    refreshCounts: {},       // Tracks refresh attempts per tooltip (key: field identifier, value: count)
    lastRefreshTimes: {},    // Timestamps of last refresh attempts (key: field identifier, value: timestamp)
    tooltipsEnabled: true,   // Global flag for enabling/disabling tooltips
    tooltipRefGlobal: null,  // Reference to the persistent tooltip UI elements
    speedDialRef: null,      // Reference to the speed dial UI elements
    temporaryTooltipRef: null, // Reference to the currently displayed temporary tooltip
    activeFetches: 0,        // Counter for ongoing API requests
};

export function updateQuestionMatrix (newData)
{
    state.questionMatrix = { ...state.questionMatrix, ...newData };
}

export function getQuestion (key)
{
    return state.questionMatrix[key];
}

export function incrementRefreshCount (key)
{
    state.refreshCounts[key] = (state.refreshCounts[key] || 0) + 1;
}

export function getRefreshCount (key)
{
    return state.refreshCounts[key] || 0;
}

export function setLastRefreshTime (key, time)
{
    state.lastRefreshTimes[key] = time;
}

export function getLastRefreshTime (key)
{
    return state.lastRefreshTimes[key] || 0;
}

export function resetRefreshTracking ()
{
    state.refreshCounts = {};
    state.lastRefreshTimes = {};
}

export function setTooltipsEnabled (enabled)
{
    state.tooltipsEnabled = enabled;
}

export function setTooltipRef (ref)
{
    state.tooltipRefGlobal = ref;
}

export function setSpeedDialRef (ref)
{
    state.speedDialRef = ref;
}

export function setTemporaryTooltipRef (ref)
{
    state.temporaryTooltipRef = ref;
}

export function incrementActiveFetches ()
{
    state.activeFetches++;
}

export function decrementActiveFetches ()
{
    state.activeFetches--;
}