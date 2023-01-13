//-----------------------------------------------------------------------------
// 0. INCLUDE common functions
//-----------------------------------------------------------------------------
var helper = require('./helper')

//-----------------------------------------------------------------------------
// 1. DRIVER SETUP - create driver object, midi ports and detection information
//-----------------------------------------------------------------------------

var midiremote_api = require('midiremote_api_v1')

var deviceDriver = midiremote_api.makeDeviceDriver('BB', 'BB Elgato', 'BB')

var midiInput = deviceDriver.mPorts.makeMidiInput()
var midiOutput = deviceDriver.mPorts.makeMidiOutput()

deviceDriver.makeDetectionUnit().detectPortPair(midiInput, midiOutput)
    .expectInputNameEquals('RealWorld In')
    .expectOutputNameEquals('RealWorld Out')

deviceDriver.makeDetectionUnit().detectPortPair(midiInput, midiOutput)
    .expectInputNameEquals('MIDIIN (RealWorld)')
    .expectOutputNameEquals('MIDIOUT (RealWorld)')

deviceDriver.makeDetectionUnit().detectPortPair(midiInput, midiOutput)
    .expectInputNameEquals('MIDIIN (RealWorld) 2')
    .expectOutputNameEquals('MIDIOUT (RealWorld) 2')

deviceDriver.makeDetectionUnit().detectPortPair(midiInput, midiOutput)
    .expectInputNameEquals('MIDIIN (RealWorld) 3')
    .expectOutputNameEquals('MIDIOUT (RealWorld) 3')

var surface = deviceDriver.mSurface

//-----------------------------------------------------------------------------
// 2. SURFACE LAYOUT - create control elements and midi bindings
//-----------------------------------------------------------------------------

var stripBindings = {
    // channel, cc
    fader: [15, 0],
    pan: [15, 8],
    mute: [15, 16],
    solo: [15, 24],
    automationRead: [15, 32],
    automationWrite: [15, 40],
    recordEnable: [15, 48],
    monitorEnable: [15, 56],
    send1: [15, 64],
    send2: [15, 72],
    send3: [15, 80],
    send4: [15, 88],
    insert1: [14, 0],
    insert2: [14, 8],
    insert3: [14,16],
    insert4: [14,24],
}

var transportBindings = {
    // channel, cc
    rewind: [15,112],
    forward: [15, 113],
    stop: [15, 114],
    start: [15, 115],
    cycle: [15, 116],
    record: [15, 117],
    metronome: [15, 118],
}

function makeFaderStrip(channelIndex, x, y) {
    var faderStrip = {}

    faderStrip.btnMute = surface.makeButton(x + 2 * channelIndex, y, 1, 1)
    faderStrip.btnSolo = surface.makeButton(x + 2 * channelIndex, y + 1, 1, 1)
    faderStrip.btnRecordEnable = surface.makeButton(x + 2 * channelIndex + 1, y, 1, 1)
    faderStrip.btnMonitorEnable = surface.makeButton(x + 2 * channelIndex + 1, y + 1, 1, 1)
    faderStrip.btnAutomationRead = surface.makeButton(x + 2 * channelIndex, y + 2, 1, 1)
    faderStrip.btnAutomationWrite = surface.makeButton(x + 2 * channelIndex + 1, y + 2, 1, 1)
    faderStrip.fader = surface.makeFader(x + 2 * channelIndex, y + 3, 2, 6).setTypeVertical()
    faderStrip.pan = surface.makeKnob(x + 2 * channelIndex, y + 10, 2, 1)
    faderStrip.send1 = surface.makeKnob(x + 2 * channelIndex, y + 11, 2, 1)
    faderStrip.send2 = surface.makeKnob(x + 2 * channelIndex, y + 12, 2, 1)
    faderStrip.send3 = surface.makeKnob(x + 2 * channelIndex, y + 13, 2, 1)
    faderStrip.send4 = surface.makeKnob(x + 2 * channelIndex, y + 14, 2, 1)
    faderStrip.insert1 = surface.makeButton(x + 2 * channelIndex, y + 15, 2, 1)
    faderStrip.insert2 = surface.makeButton(x + 2 * channelIndex, y + 16, 2, 1)
    faderStrip.insert3 = surface.makeButton(x + 2 * channelIndex, y + 17, 2, 1)
    faderStrip.insert4 = surface.makeButton(x + 2 * channelIndex, y + 18, 2, 1)
    faderStrip.insert2next = surface.makeCustomValueVariable('faderstrip_insert2_next')
    faderStrip.insert2reset = surface.makeCustomValueVariable('faderstrip_insert2_reset')
    

    faderStrip.btnMute.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.mute[0], stripBindings.mute[1] + channelIndex)
    faderStrip.btnSolo.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.solo[0], stripBindings.solo[1] + channelIndex)
    faderStrip.btnRecordEnable.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.recordEnable[0], stripBindings.recordEnable[1] + channelIndex)
    faderStrip.btnMonitorEnable.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.monitorEnable[0], stripBindings.monitorEnable[1] + channelIndex)
    faderStrip.btnAutomationRead.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.automationRead[0], stripBindings.automationRead[1] + channelIndex)
    faderStrip.btnAutomationWrite.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.automationWrite[0], stripBindings.automationWrite[1] + channelIndex)
    faderStrip.fader.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.fader[0], stripBindings.fader[1] + channelIndex)
    faderStrip.pan.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.pan[0], stripBindings.pan[1] + channelIndex)
    
    faderStrip.send1.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.send1[0], stripBindings.send1[1] + channelIndex)
    faderStrip.send2.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.send2[0], stripBindings.send2[1] + channelIndex)
    faderStrip.send3.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.send3[0], stripBindings.send3[1] + channelIndex)
    faderStrip.send4.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.send4[0], stripBindings.send4[1] + channelIndex)
    
    faderStrip.insert1.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.insert1[0], stripBindings.insert1[1] + channelIndex)
    faderStrip.insert2.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.insert2[0], stripBindings.insert2[1] + channelIndex)
    faderStrip.insert3.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.insert3[0], stripBindings.insert3[1] + channelIndex)
    faderStrip.insert4.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(stripBindings.insert4[0], stripBindings.insert4[1] + channelIndex)

    faderStrip.fader.mSurfaceValue.mOnProcessValueChange = function (context, newValue, oldValue) {
        midiOutput.sendMidi(context, helper.sysex.setDisplayValueOfColumn(channelIndex, 0, newValue * (127)))
    }

    faderStrip.fader.mSurfaceValue.mOnDisplayValueChange = function (context, value, units) {
        midiOutput.sendMidi(context, helper.sysex.displaySetTextOfColumn(channelIndex, 2, value))
    }

    faderStrip.fader.mSurfaceValue.mOnTitleChange = function (context, objectTitle, valueTitle) {
        midiOutput.sendMidi(context, helper.sysex.displaySetTextOfColumn(channelIndex, 0, objectTitle))
        midiOutput.sendMidi(context, helper.sysex.displaySetTextOfColumn(channelIndex, 1, valueTitle))
    }

    faderStrip.fader.mSurfaceValue.mOnColorChange = function (context, r, g, b, a, isActive) {
        function updateRow(rowIdx, r, g, b, a) {
            midiOutput.sendMidi(context, helper.sysex.setDisplayColorOfColumn(channelIndex, rowIdx, r * 127 * a, g * 127 * a, b * 127 * a))
        }

        function updateAllRows(r, g, b, a) {
            for(var rowIdx = 0; rowIdx < 4; ++rowIdx)
                updateRow(rowIdx, r, g, b, a)
        }

        if(isActive)
            updateAllRows(r, g, b, a)
        else
            updateAllRows(1, 1, 1, 1)
    }

    return faderStrip
}

function makeKnobStrip(knobIndex, x, y) {
    var knobStrip = {}
    
    knobStrip.knob = surface.makeKnob(x + 2 * knobIndex, y, 2, 2)
    knobStrip.knob.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(15, 21 + knobIndex).setTypeRelativeTwosComplement()

    return knobStrip
}



function makeTransport(x, y) {
    var transport = {}

    var w = 2
    var h = 2

    var currX = x

    function bindMidiCC(button, chn, num) {
        button.mSurfaceValue.mMidiBinding.setInputPort(midiInput).setOutputPort(midiOutput).bindToControlChange(chn, num)
    }
    
    transport.btnRewind = surface.makeButton(currX, y, w, h)
    bindMidiCC(transport.btnRewind, transportBindings.rewind[0], transportBindings.rewind[1])
    currX = currX + w

    transport.btnForward = surface.makeButton(currX, y, w, h)
    bindMidiCC(transport.btnForward, transportBindings.forward[0], transportBindings.forward[1])
    currX = currX + w

    transport.btnStop = surface.makeButton(currX, y, w, h)
    bindMidiCC(transport.btnStop, transportBindings.stop[0], transportBindings.stop[1])
    currX = currX + w

    transport.btnStart = surface.makeButton(currX, y, w, h)
    bindMidiCC(transport.btnStart, transportBindings.start[0], transportBindings.start[1])
    currX = currX + w

    transport.btnCycle = surface.makeButton(currX, y, w, h)
    bindMidiCC(transport.btnCycle, transportBindings.cycle[0], transportBindings.cycle[1])
    currX = currX + w

    transport.btnRecord = surface.makeButton(currX, y, w, h)
    bindMidiCC(transport.btnRecord, transportBindings.record[0], transportBindings.record[1])
    currX = currX + w

    transport.btnMetronome = surface.makeButton(currX, y, w, h)
    bindMidiCC(transport.btnMetronome, transportBindings.metronome[0], transportBindings.metronome[1])
    currX = currX + w

    return transport
}

/*

'AddTrack', 'OpenDialog'
'AddTrack', 'Arranger'
'AddTrack', 'Audio'
'AddTrack', 'Audio Mono'
'AddTrack', 'Chord'
'AddTrack', 'FX Channel'
'AddTrack', 'Folder'
'AddTrack', 'Group Channel'
'AddTrack', 'Instrument'
'AddTrack', 'MIDI'
'AddTrack', 'Marker'
'AddTrack', 'Ruler'
'AddTrack', 'Sampler'
'AddTrack', 'Signature'
'AddTrack', 'Tempo'
'AddTrack', 'TransposeTrack'
'AddTrack', 'From Track Presets'
'AddTrack', 'VCA Fader'
'AddTrack', 'Video'
'Analyze', 'Spectrum Analyzer'
'Analyze', 'Statistics'
'Arranger', 'Activate'
'Arranger', 'First Repeat'
'Arranger', 'Last Repeat'
'Arranger', 'Next Chain Step'
'Arranger', 'Previous Chain Step'
'Arranger', 'Trigger Arranger Event 1'
'Arranger', 'Trigger Arranger Event 2'
'Arranger', 'Trigger Arranger Event 3'
'Arranger', 'Trigger Arranger Event 4'
'Arranger', 'Trigger Arranger Event 5'
'Arranger', 'Trigger Arranger Event 6'
'Arranger', 'Trigger Arranger Event 7'
'Arranger', 'Trigger Arranger Event 8'
'Arranger', 'Trigger Arranger Event 9'
'Arranger', 'Trigger Arranger Event 10'
'Arranger', 'Trigger Arranger Event 11'
'Arranger', 'Trigger Arranger Event 12'
'Arranger', 'Trigger Arranger Event 13'
'Arranger', 'Trigger Arranger Event 14'
'Arranger', 'Trigger Arranger Event 15'
'Arranger', 'Trigger Arranger Event 16'
'Arranger', 'Trigger Arranger Event 17'
'Arranger', 'Trigger Arranger Event 18'
'Arranger', 'Trigger Arranger Event 19'
'Arranger', 'Trigger Arranger Event 20'
'Audio', 'Adjust Fades to Range'
'Audio', 'Apply Standard Fade In'
'Audio', 'Apply Standard Fade Out'
'Audio', 'Auto-Grid'
'Audio', 'Bounce'
'Audio', 'Close Gaps'
'Audio', 'Close Gaps (Crossfade)'
'Audio', 'Constrain Delay Compensation'
'Audio', 'Convert Tracks: Mono to Multi-Channel'
'Audio', 'Convert Tracks: Multi-Channel to Mono'
'Audio', 'Copy Warp Markers from Selected Event.'
'Audio', 'Create Sampler Track'
'Audio', 'Crossfade'
'Audio', 'Decrement Event Volume'
'Audio', 'Decrement Fade In Length'
'Audio', 'Decrement Fade Out Length'
'Audio', 'Delete Overlaps'
'Audio', 'Detect Silence'
'Audio', 'Disable/Enable Track'
'Audio', 'Dissolve Part'
'Audio', 'Event or Range as Region'
'Audio', 'Events from Regions'
'Audio', 'Events to Part'
'Audio', 'Fade In to Cursor'
'Audio', 'Fade In to Range Start'
'Audio', 'Fade Out to Cursor'
'Audio', 'Fade Out from Range End'
'Audio', 'Find Selected in Pool'
'Audio', 'Generate Harmony Voices'
'Audio', 'Increment Event Volume'
'Audio', 'Increment Fade In Length'
'Audio', 'Increment Fade Out Length'
'Audio', 'Invert Phase On/Off'
'Audio', 'Make Extension from Selected Events Permanent'
'Audio', 'Minimize File'
'Audio', 'To Origin'
'Audio', 'Open Fade Editors'
'Audio', 'Paste Warp Markers to Selected Events.'
'Audio', 'Remove Extension from Selected Events'
'Audio', 'Remove Fade In'
'Audio', 'Remove Fade Out'
'Audio', 'Remove Fades'
'Audio', 'Remove Volume Curve'
'Audio', 'Set Definition From Tempo'
'Audio', 'Set Tempo From Event'
'Audio', 'Snap Point to Cursor'
'Audio', 'Stretch to Project Tempo'
'Audio', 'Update Origin'
'Audio Alignment', 'Add Selection as Alignment Reference'
'Audio Alignment', 'Add Selection as Alignment Target'
'Audio Alignment', 'Align Audio'
'Audio Alignment', 'Open Audio Alignment Panel'
'Audio Alignment', 'Remove Alignment Reference'
'Audio Alignment', 'Remove All Alignment Targets'
'Audio Export', 'Increase Counter Start Value'
'Audio Export', 'Perform Audio Export'
'Audio Export', 'Reset Counter Start Value'
'Audio Export', 'Sync Channel Selection with Mixer'
'Audio Performance', 'Reset Processing Overload Indicator'
'Audio Realtime Processing', 'Create Warp Tabs from Hitpoints'
'Audio Realtime Processing', 'Flatten Realtime Processing'
'Audio Realtime Processing', 'Unstretch Audio'
'Automation', 'Automation Mode - Auto-Latch'
'Automation', 'Automation Mode - Cross-Over'
'Automation', 'Automation Mode - Touch'
'Automation', 'Automation Mode - Trim'
'Automation', 'Delete All Automation in Project'
'Automation', 'Delete Automation in Range'
'Automation', 'Delete Automation of Selected Tracks'
'Automation', 'Fill Gaps'
'Automation', 'Fill Gaps on Selected Tracks'
'Automation', 'Fill Gaps with Current Value (Selected Tracks)'
'Automation', 'Fill Loop'
'Automation', 'Fill To End'
'Automation', 'Fill To Punch'
'Automation', 'Fill To Start'
'Automation', 'Freeze All Trim Automation in Project'
'Automation', 'Freeze Trim Automation of Selected Tracks'
'Automation', 'Hide All Automation'
'Automation', 'Hide Automation'
'Automation', 'Next Automation Mode'
'Automation', 'Open Panel'
'Automation', 'Punch Out of Latch Automation'
'Automation', 'Toggle Read Enable All Tracks'
'Automation', 'Toggle Read Enable Selected Tracks'
'Automation', 'Show All - Used Only'
'Automation', 'Show All EQ Automation'
'Automation', 'Show All Insert Automation'
'Automation', 'Show All Pan Automation'
'Automation', 'Show All Send Automation'
'Automation', 'Show All Used Automation'
'Automation', 'Show All Volume Automation'
'Automation', 'Show Automation'
'Automation', 'Show Used Automation (Selected Tracks)'
'Automation', 'Suspend Reading All'
'Automation', 'Suspend Reading Dynamics'
'Automation', 'Suspend Reading EQ'
'Automation', 'Suspend Reading Inserts'
'Automation', 'Suspend Reading Mute'
'Automation', 'Suspend Reading Others'
'Automation', 'Suspend Reading Pan'
'Automation', 'Suspend Reading Sends'
'Automation', 'Suspend Reading Volume'
'Automation', 'Suspend Reading/Writing All'
'Automation', 'Suspend Writing All'
'Automation', 'Suspend Writing Dynamics'
'Automation', 'Suspend Writing EQ'
'Automation', 'Suspend Writing Inserts'
'Automation', 'Suspend Writing Mute'
'Automation', 'Suspend Writing Others'
'Automation', 'Suspend Writing Pan'
'Automation', 'Suspend Writing Sends'
'Automation', 'Suspend Writing Volume'
'Automation', 'Use Virgin Territories'
'Automation', 'Toggle Write Enable All Tracks'
'Automation', 'Toggle Write Enable Selected Tracks'
'Beat Designer', 'Fill Loop with Pattern'
'Beat Designer', 'Insert Pattern at Cursor'
'Beat Designer', 'Insert Pattern at Left Locator'
'Beat Designer', 'Insert Subbank at Cursor'
'Beat Designer', 'Insert Subbank at Left Locator'
'Channel & Track Visibility', 'HideMuted'
'Channel & Track Visibility', 'HideSelected'
'Channel & Track Visibility', 'channelOrganizerRedo'
'Channel & Track Visibility', 'ShowAll'
'Channel & Track Visibility', 'ShowConnected'
'Channel & Track Visibility', 'ShowUsed'
'Channel & Track Visibility', 'ShowPlaying'
'Channel & Track Visibility', 'ShowCycle'
'Channel & Track Visibility', 'ShowSelected'
'Channel & Track Visibility', 'ShowMarked'
'Channel & Track Visibility', 'channelOrganizerUndo'
'Channel & Track Visibility', 'Create Track Visibility Configuration'
'Channel & Track Visibility', 'Sync Visibility of Project and MixConsole: On/Off'
'Channel & Track Visibility', 'Update Track Visibility Configuration'
'Channel & Track Visibility', 'Channel and Rack Configuration 1'
'Channel & Track Visibility', 'Channel and Rack Configuration 2'
'Channel & Track Visibility', 'Channel and Rack Configuration 3'
'Channel & Track Visibility', 'Channel and Rack Configuration 4'
'Channel & Track Visibility', 'Channel and Rack Configuration 5'
'Channel & Track Visibility', 'Channel and Rack Configuration 6'
'Channel & Track Visibility', 'Channel and Rack Configuration 7'
'Channel & Track Visibility', 'Channel and Rack Configuration 8'
'Channel Settings', 'Show/Hide Direct Routing'
'Channel Settings', 'Show/Hide Output Chain'
'Chords', 'Notes To Voices'
'Chords', 'Chord Editing - Add to Chord Track'
'Chords', 'Chord Editing - Drop 2'
'Chords', 'Chord Editing - Drop 2 + 4'
'Chords', 'Chord Editing - Drop 3'
'Chords', 'Chord Editing - Inversions: Move Down'
'Chords', 'Chord Editing - Inversions: Move Up'
'Chords', 'Chord Editing - Match with Chord Track'
'Chords', 'ChordPadSetup'
'Chords', 'Chords to MIDI'
'Chords', 'Make Chords'
'Chords', 'Map to Chord Track'
'Chords', 'Set up Scales'
'Chords', 'ChordPad'
'Control Room', 'Switch: AFL/PFL'
'Control Room', 'Switch: Click Active'
'Control Room', 'Switch: Activate Speakers'
'Control Room', 'Switch: Activate Studio 1'
'Control Room', 'Switch: Activate Studio 2'
'Control Room', 'Switch: Activate Studio 3'
'Control Room', 'Switch: Activate Studio 4'
'Control Room', 'Switch: Listen Cancel'
'Control Room', 'Switch: Dim Active'
'Control Room', 'Switch: Listen Enable'
'Control Room', 'Switch: Activate Phones'
'Control Room', 'Switch: Reference Level Active'
'Control Room', 'Switch: Source Select'
'Control Room', 'Switch: Folddown Select 1'
'Control Room', 'Switch: Folddown Select 2'
'Control Room', 'Switch: Folddown Select 3'
'Control Room', 'Switch: Folddown Select 4'
'Control Room', 'Switch: Speakers Select 1'
'Control Room', 'Switch: Speakers Select 2'
'Control Room', 'Switch: Speakers Select 3'
'Control Room', 'Switch: Speakers Select 4'
'Control Room', 'Switch: Folddown Select'
'Control Room', 'Switch: Speakers Select'
'Control Room', 'Speaker Solo: Cancel'
'Control Room', 'Speaker Solo: Center'
'Control Room', 'Speaker Solo: Front'
'Control Room', 'Speaker Solo: LFE'
'Control Room', 'Speaker Solo: Left'
'Control Room', 'Speaker Solo: Left of Center'
'Control Room', 'Speaker Solo: Left-Right'
'Control Room', 'Speaker Solo: Rear'
'Control Room', 'Speaker Solo: Rear to Front'
'Control Room', 'Speaker Solo: Right'
'Control Room', 'Speaker Solo: Right of Center'
'Control Room', 'Speaker Solo: Side'
'Control Room', 'Speaker Solo: Side Left'
'Control Room', 'Speaker Solo: Side Right'
'Control Room', 'Speaker Solo: Solo to Center'
'Control Room', 'Speaker Solo: Surround Left'
'Control Room', 'Speaker Solo: Surround Right'
'Control Room', 'Speaker Solo: Top Side Left'
'Control Room', 'Speaker Solo: Top Side Right'
'Control Room', 'Switch: Talkback Active'
'Crossfade Editor', 'Play Crossfade'
'Crossfade Editor', 'Play Fade In'
'Crossfade Editor', 'Play Fade Out'
'Devices', 'VST Connections'
'Devices', 'Control Room Mixer'
'Devices', 'MIDI Device Manager'
'Devices', 'MIDI Remote Manager'
'Devices', 'MMC Master'
'Devices', 'MixConsole Lower Zone'
'Devices', 'Mixer'
'Devices', 'Mixer 2'
'Devices', 'Mixer 3'
'Devices', 'Mixer 4'
'Devices', 'Plug-in Information'
'Devices', 'Plug-in Manager'
'Devices', 'Record Time Max'
'Devices', 'Setup'
'Devices', 'Show Panel'
'Devices', 'TestMixerFDH'
'Devices', 'Time Display'
'Devices', 'VST Channel Load'
'Devices', 'VST Instruments'
'Devices', 'VST Network Monitor'
'Devices', 'VST Performance'
'Devices', 'VST Routing'
'Devices', 'Video'
'Devices', 'Virtual Keyboard'
'Direct Offline Processing', 'Add Plug-in'
'Direct Offline Processing', 'Add Process'
'Direct Offline Processing', 'Apply'
'Direct Offline Processing', 'Bank 1'
'Direct Offline Processing', 'Bank 2'
'Direct Offline Processing', 'Bank 3'
'Direct Offline Processing', 'Bank 4'
'Direct Offline Processing', 'Bypass Selected Process'
'Direct Offline Processing', 'Direct Offline Processing'
'Direct Offline Processing', 'Discard'
'Direct Offline Processing', 'Favorite 1'
'Direct Offline Processing', 'Favorite 2'
'Direct Offline Processing', 'Favorite 3'
'Direct Offline Processing', 'Favorite 4'
'Direct Offline Processing', 'Favorite 5'
'Direct Offline Processing', 'Favorite 6'
'Direct Offline Processing', 'Favorite 7'
'Direct Offline Processing', 'Favorite 8'
'Direct Offline Processing', 'Favorite 9'
'Direct Offline Processing', 'Make All Permanent'
'Direct Offline Processing', 'Toggle Auto Apply'
'Edit', 'Acoustic Feedback On/Off'
'Edit', 'Activate Next Part'
'Edit', 'Activate Previous Part'
'Edit', 'Activate/Deactivate'
'Edit', 'Click Pattern Copy'
'Edit', 'Apply Project Logical Preset'
'Edit', 'Auto Select Events under Cursor'
'Edit', 'Autoscroll'
'Edit', 'Automation follows Events'
'Edit', 'Clean Up Lanes'
'Edit', 'Click Pattern to Default'
'Edit', 'To Real Copy'
'Edit', 'Copy'
'Edit', 'Copy A<->B Setting'
'Edit', 'Copy Click Pattern'
'Edit', 'Create Tracks from Lanes'
'Edit', 'Crop Range'
'Edit', 'Cut'
'Edit', 'Cut Head'
'Edit', 'Cut Tail'
'Edit', 'Cut Time'
'Edit', 'Unmute All'
'Edit', 'Deactivate All Solo'
'Edit', 'Delete'
'Edit', 'Delete Time'
'Edit', 'Duplicate'
'Edit', 'Edit Active Part Only'
'Edit', 'Edit Channel Panner'
'Edit', 'Edit Channel Settings'
'Edit', 'Edit Info Line'
'Edit', 'Edit VST Instrument'
'Edit', 'Enlarge Range to Next Event'
'Edit', 'Enlarge Range to Previous Event'
'Edit', 'Enlarge Selected Track'
'Edit', 'Select Equal Pitch'
'Edit', 'Select Same Pitch'
'Edit', 'Expand/Reduce'
'Edit', 'Fill Loop'
'Edit', 'Find Track/Channel'
'Edit', 'Global Copy'
'Edit', 'Glue'
'Edit', 'Grid Type: Adapt to Zoom'
'Edit', 'Grid Type: Bar'
'Edit', 'Grid Type: Beat'
'Edit', 'Grid Type: Use Quantize'
'Edit', 'Group'
'Edit', 'Toggle Group Tracks'
'Edit', 'History'
'Edit', 'Insert Bars'
'Edit', 'Insert Silence'
'Edit', 'Flip/Invert'
'Edit', 'Invert Selection'
'Edit', 'Key Commands'
'Edit', 'Left Selection Side to Cursor'
'Edit', 'Listen'
'Edit', 'Lock'
'Edit', 'Lock/Unlock Track'
'Edit', 'Monitor'
'Edit', 'Move end to Cursor'
'Edit', 'Move to Cursor'
'Edit', 'Move to Back'
'Edit', 'Move to Front'
'Edit', 'Move to Selected Track'
'Edit', 'Move Insert Cursor To Part Start'
'Edit', 'Mute'
'Edit', 'Mute Events'
'Edit', 'Mute/Unmute Objects'
'Edit', 'Open'
'Edit', 'Open Device Panel'
'Edit', 'Project Logical Editor'
'Edit', 'Paste'
'Edit', 'Paste Click Pattern to similar Selected'
'Edit', 'Paste Relative to Cursor'
'Edit', 'Paste Time'
'Edit', 'Paste Time at Origin'
'Edit', 'Paste at Origin'
'Edit', 'Paste to Matching Track Name'
'Edit', 'Preferences'
'Edit', 'Primary Parameter: Decrease'
'Edit', 'Primary Parameter: Fine Decrease'
'Edit', 'Primary Parameter: Fine Increase'
'Edit', 'Primary Parameter: Increase'
'Edit', 'Process Tempo'
'Edit', 'ProfileManager'
'Edit', 'Range to Next Event'
'Edit', 'Range to Previous Event'
'Edit', 'Read'
'Edit', 'Record Enable'
'Edit', 'Redo'
'Edit', 'Rename'
'Edit', 'Rename First Selected Track'
'Edit', 'Create Audio Click Track'
'Edit', 'Create MIDI Click Track'
'Edit', 'Repeat'
'Edit', 'Reset to Default'
'Edit', 'Right Selection Side to Cursor'
'Edit', 'Ruler Display Format'
'Edit', 'Ruler Mode: Bars+Beats Linear'
'Edit', 'Ruler Mode: Time Linear'
'Edit', 'Save as Default'
'Edit', 'Scale Assistant: Quantize Pitches'
'Edit', 'Scale Assistant: Toggle Show Scale Note Guides'
'Edit', 'Scale Assistant: Toggle Snap Live Input'
'Edit', 'Scale Assistant: Toggle Snap Pitch Editing'
'Edit', 'Secondary Parameter: Decrease'
'Edit', 'Secondary Parameter: Fine Decrease'
'Edit', 'Secondary Parameter: Fine Increase'
'Edit', 'Secondary Parameter: Increase'
'Edit', 'Select All'
'Edit', 'Select All on Tracks'
'Edit', 'Select Controllers in Note Range'
'Edit', 'Select Event'
'Edit', 'Select Events under Cursor'
'Edit', 'Select Next Grid Type'
'Edit', 'Select Next Snap Type'
'Edit', 'Select None'
'Edit', 'Select Prev Grid Type'
'Edit', 'Select Prev Snap Type'
'Edit', 'Select from Cursor to End'
'Edit', 'Select from Start to Cursor'
'Edit', 'Select in Loop'
'Edit', 'Set Spacer between Selected Events'
'Edit', 'Click Pattern Visible'
'Edit', 'Lane Display Type'
'Edit', 'Slip Event Content Left'
'Edit', 'Slip Event Content Right'
'Edit', 'Snap Off'
'Edit', 'Snap On'
'Edit', 'Snap On/Off'
'Edit', 'Snap Type: Events'
'Edit', 'Snap Type: Events + Cursor'
'Edit', 'Snap Type: Events + Grid + Cursor'
'Edit', 'Snap Type: Grid'
'Edit', 'Snap Type: Grid + Cursor'
'Edit', 'Snap Type: Grid Relative'
'Edit', 'Snap Type: Magnetic Cursor'
'Edit', 'Snap Type: Shuffle'
'Edit', 'Solo'
'Edit', 'Solo Defeat'
'Edit', 'Solo Lane'
'Edit', 'Split Loop'
'Edit', 'Split Range'
'Edit', 'Split at Cursor'
'Edit', 'Stationary Cursor'
'Edit', 'Switch MIDI Editor Grid Type'
'Edit', 'Toggle A/B Setting'
'Edit', 'Toggle Link Project and Lower Zone Editor Cursors'
'Edit', 'Undo'
'Edit', 'Ungroup'
'Edit', 'Unlock'
'Edit', 'Unmute Events'
'Edit', 'Write'
'Editors', 'Edit Inplace'
'Editors', 'Open Audio Part Editor'
'Editors', 'Open Audio Part Editor in Lower Zone'
'Editors', 'Open Audio Part Editor in Window'
'Editors', 'Open Drum Editor'
'Editors', 'Open Drum Editor in Lower Zone'
'Editors', 'Open Drum Editor in Window'
'Editors', 'Open In-Place Editor'
'Editors', 'Open Key Editor'
'Editors', 'Open Key Editor in Lower Zone'
'Editors', 'Open Key Editor in Window'
'Editors', 'Open List Editor'
'Editors', 'Open Sample Editor'
'Editors', 'Open Sample Editor in Lower Zone'
'Editors', 'Open Sample Editor in Window'
'Editors', 'Open Score Editor'
'Editors', 'Open Score Editor in Lower Zone'
'Editors', 'Open Score Editor in Window'
'Editors', 'Open in separate Window/Lower Zone'
'Editors', 'Open/Close Editor'
'Editors', 'Set up Editor Preferences'
'Editors', 'Show/Hide Global Tracks in Editor'
'Export', 'AAF'
'File', 'Back up Project'
'File', 'Close'
'File', 'Export Audio Mixdown'
'File', 'Export MIDI File'
'File', 'Export MIDI Loop'
'File', 'Export Master Track'
'File', 'Export MusicXML'
'File', 'Export Notepad Data'
'File', 'Export Pool'
'File', 'Export Selected Events'
'File', 'Export Selected Tracks'
'File', 'Export Video'
'File', 'Import Audio File'
'File', 'Import Audio from Video'
'File', 'Import MIDI File'
'File', 'Import Master Track'
'File', 'Import MusicXML'
'File', 'Import Pool'
'File', 'Import Track Archive'
'File', 'Import Tracks from Project'
'File', 'Import Video File'
'File', 'Import from Audio CD'
'File', 'New'
'File', 'New Empty'
'File', 'New Library'
'File', 'Open'
'File', 'Open Library'
'File', 'PageSetup'
'File', 'Perform Export Selected Events'
'File', 'Print'
'File', 'Quit'
'File', 'Revert'
'File', 'Save'
'File', 'Save As'
'File', 'Save Pool'
'File', 'Save New Version'
'File', 'Save as Template'
'File', 'Export Scores'
'File', 'Write MIDI File to Project Folder'
'Focus', 'Back'
'Focus', 'Hit'
'Focus', 'Escape'
'Focus', 'Fore'
'Game Audio Connect', 'Trigger Export to Game Audio Engine'
'HeadTracking', 'Show Dialog'
'Hitpoints', 'Calculate'
'Hitpoints', 'Create Audio Slices from Hitpoints'
'Hitpoints', 'Create Markers from Hitpoints'
'Hitpoints', 'Divide Audio Events at Hitpoints'
'Hitpoints', 'Remove Hitpoints'
'Hub', 'Steinberg Hub'
'Import', 'AAF'
'Inspector', 'Open Next Section'
'Inspector', 'Open Previous Section'
'Inspector', 'Toggle Channel Section'
'Inspector', 'Toggle Cue Sends Section'
'Inspector', 'Toggle User Panel Section'
'Inspector', 'Toggle Direct Routing Section'
'Inspector', 'Toggle EQs Section'
'Inspector', 'Toggle Expression Map Section'
'Inspector', 'Toggle Inserts Section'
'Inspector', 'Toggle Parameters Section'
'Inspector', 'Toggle Note Expression Section'
'Inspector', 'Toggle Notepad Section'
'Inspector', 'Toggle Quick Controls Section'
'Inspector', 'Toggle Sends Section'
'Inspector', 'Toggle Standard Section'
'Key Commands', 'Open Key Commands Launcher'
'MIDI', 'Apply Logical Preset'
'MIDI', 'Auto Select Controllers'
'MIDI', 'Bounce'
'MIDI', 'Controller Lane Setup 1'
'MIDI', 'Controller Lane Setup 2'
'MIDI', 'Controller Lane Setup 3'
'MIDI', 'Controller Lane Setup 4'
'MIDI', 'Controller Lane Setup 5'
'MIDI', 'Controller Lane Setup 6'
'MIDI', 'Controller Lane Setup 7'
'MIDI', 'Controller Lane Setup 8'
'MIDI', 'Controller Lane Setup 9'
'MIDI', 'Controller Lane Setup 10'
'MIDI', 'Controller Lane Setup 11'
'MIDI', 'Controller Lane Setup 12'
'MIDI', 'Controller Lane Setup 13'
'MIDI', 'Controller Lane Setup 14'
'MIDI', 'Controller Lane Setup 15'
'MIDI', 'Controller Lane Setup 16'
'MIDI', 'Delete Continuous Controllers'
'MIDI', 'Delete Controllers'
'MIDI', 'Delete Doubles'
'MIDI', 'Delete Notes'
'MIDI', 'Delete Overlaps (mono)'
'MIDI', 'Delete Overlaps (poly)'
'MIDI', 'Dissolve Part'
'MIDI', 'Drum Editor Length Display'
'MIDI', 'Drummap Setup'
'MIDI', 'InstrumentMap Setup'
'MIDI', 'Extract MIDI'
'MIDI', 'Fixed Lengths'
'MIDI', 'Fixed Velocity'
'MIDI', 'Freeze Length'
'MIDI', 'Freeze Track Params'
'MIDI', 'Insert Velocity 1'
'MIDI', 'Insert Velocity 2'
'MIDI', 'Insert Velocity 3'
'MIDI', 'Insert Velocity 4'
'MIDI', 'Insert Velocity 5'
'MIDI', 'Legato'
'MIDI', 'List Editor: Show/Hide Filters'
'MIDI', 'Merge MIDI'
'MIDI', 'Merge Tempo from Tapping'
'MIDI', 'Mirror'
'MIDI', 'ONote Conversion'
'MIDI', 'Open CC Automation Setup Dialog'
'MIDI', 'Open Insert Velocities Dialog'
'MIDI', 'Logical Editor'
'MIDI', 'Pedals to Note Length'
'MIDI', 'Pitch Visibility: On/Off'
'MIDI', 'Pitch Visibility: Select Next Option'
'MIDI', 'Pitchbend: Snap Pitchbend Events On/Off'
'MIDI', 'Project Input Transformer'
'MIDI', 'Record In Editor'
'MIDI', 'Repeat Loop'
'MIDI', 'Reset'
'MIDI', 'Restrict Polyphony'
'MIDI', 'Reverse'
'MIDI', 'Send All Notes Off Message'
'MIDI', 'Show Used Controllers'
'MIDI', 'Show/Hide Controller Lanes'
'MIDI', 'Thin Out'
'MIDI', 'Toggle Computer Keyboard Input'
'MIDI', 'Toggle MIDI Input'
'MIDI', 'Toggle Step Input'
'MIDI', 'Transpose'
'MIDI', 'Transpose Notes'
'MIDI', 'Type of New Controller Events: Toggle Step/Ramp'
'MIDI', 'Velocity'
'MIDI Remote', 'Open MIDI Remote Mapping Assistant'
'MIDI Remote', 'Scripting Tools: Highlight Bounding Rects'
'MIDI Remote', 'Scripting Tools: Open Console'
'MIDI Remote', 'Scripting Tools: Open ReadMe'
'MIDI Remote', 'Scripting Tools: Open Script Folder'
'MIDI Remote', 'Scripting Tools: Reload Scripts'
'MIDI Remote', 'Show/Hide Functions Browser in MIDI Remote Mapping Assistant'
'Marker', 'Activate Marker Track'
'Marker', 'Insert and name Cycle Marker'
'Marker', 'Insert and name Marker'
'Media', 'Add Favorite'
'Media', 'Browse: Back'
'Media', 'Browse: Forward'
'Media', 'Browse: Up'
'Media', 'Converter'
'Media', 'Create Folder'
'Media', 'Create New Folder'
'Media', 'Create Sampler Track'
'Media', 'Open Debug Browser'
'Media', 'Empty Trash'
'Media', 'Check Files'
'Media', 'Generate Thumbnail Cache'
'Media', 'Hide Folders That Are Not Scanned'
'Media', 'Import Medium'
'Media', 'Import from Audio CD'
'Media', 'Insert into Project at Cursor'
'Media', 'Insert into Project at Left Locator'
'Media', 'Insert into Project at Origin'
'Media', 'Open Loop Browser'
'Media', 'New Version'
'Media', 'Open MediaBay'
'Media', 'Open Remote Browser'
'Media', 'Open/Close Attribute Inspector'
'Media', 'Open/Close Favorites'
'Media', 'Open/Close File Browser'
'Media', 'Open/Close Filters'
'Media', 'Open/Close Previewer'
'Media', 'Prepare Archive'
'Media', 'Preview Active On/Off'
'Media', 'Preview AutoPlay On/Off'
'Media', 'Preview Cycle On/Off'
'Media', 'Preview Pause On/Off'
'Media', 'Preview Start'
'Media', 'Preview Stop'
'Media', 'Preview Sync On/Off'
'Media', 'Preview in Context On/Off'
'Media', 'Reconstruct'
'Media', 'Refresh Views'
'Media', 'Remove Favorite'
'Media', 'Remove Missing Files'
'Media', 'Remove Unused Media'
'Media', 'Rescan Disk'
'Media', 'Reset All Filters'
'Media', 'Reset Result Filters'
'Media', 'Reset Search'
'Media', 'Results: Include Folders and Subfolders'
'Media', 'Revert'
'Media', 'Search MediaBay'
'Media', 'Select In Project'
'Media', 'Select Media Types'
'Media', 'Set Record Folder'
'Media', 'Show Only Selected Folder'
'Media', 'OpenInExplorer'
'Media', 'Shuffle Results'
'Media', 'Open Sound Browser'
'Media', 'Stop Updating Results'
'Media', 'Update Results'
'Media', 'Write Attributes to File'
'MediaInspector', 'RemoveAttribute'
'MediaList', 'CommitTags'
'MediaList', 'RemoveWriteProtection'
'MediaList', 'SetWriteProtection'
'MixConsole History', 'Redo MixConsole Step'
'MixConsole History', 'Undo MixConsole Step'
'MixConsole Snapshots', 'Save MixConsole Snapshot'
'Mixer', 'Arm All Audio Tracks'
'Mixer', 'Add Track To Selected: FX Channel'
'Mixer', 'Add Track To Selected: Group Channel'
'Mixer', 'Add Track To Selected: VCA Fader'
'Mixer', 'Bypass: Channel Strip'
'Mixer', 'Bypass: Channel Strip on Main Mix'
'Mixer', 'Bypass: EQs'
'Mixer', 'Bypass: EQs on Main Mix'
'Mixer', 'Bypass: Inserts'
'Mixer', 'Bypass: Inserts on Main Mix'
'Mixer', 'Bypass: Sends'
'Mixer', 'Disarm All Audio Tracks'
'Mixer', 'Direct Routing: Summing Mode On/Off'
'Mixer', 'EQ/Filter Transition: Quick'
'Mixer', 'EQ/Filter Transition: Soft'
'Mixer', 'Panner: Open/Close Selected'
'Mixer', 'Settings: Open/Close Selected'
'Mixer', 'Expand: Channel Strip'
'Mixer', 'Expand: Cue Sends'
'Mixer', 'Expand: Device Panels'
'Mixer', 'Expand: Direct Routing'
'Mixer', 'Expand: EQs'
'Mixer', 'Expand: Filters/Gain'
'Mixer', 'Expand: Inserts'
'Mixer', 'Expand: Quick Controls'
'Mixer', 'Expand: Routing'
'Mixer', 'Expand: Sends'
'Mixer', 'Expand: VCA'
'Mixer', 'File: Load Selected Channels'
'Mixer', 'File: Save Selected Channels'
'Mixer', 'Hide: Audio'
'Mixer', 'Hide: Groups'
'Mixer', 'Hide: Inputs'
'Mixer', 'Hide: Instruments'
'Mixer', 'Hide: MIDI'
'Mixer', 'Hide: Outputs'
'Mixer', 'Hide: Returns'
'Mixer', 'Hide: VCAs'
'Mixer', 'Link Channels'
'Mixer', 'Control Link: Edit Control Link Settings'
'Mixer', 'Control Link: Next Control Link Group'
'Mixer', 'Control Link: Previous Control Link Group'
'Mixer', 'Channels: Listen On/Off'
'Mixer', 'Loudness: Enable'
'Mixer', 'Loudness: Reset'
'Mixer', 'Loudness: Switch between +9dB and +18dB Scale'
'Mixer', 'Loudness: Switch between LU and LUFS'
'Mixer', 'Master Meter: AES17 (+3dB)'
'Mixer', 'Meters: Hold Forever'
'Mixer', 'Meters: Hold Peaks'
'Mixer', 'Meters: Input'
'Mixer', 'Meters: Post Fader'
'Mixer', 'Meters: Post Panner'
'Mixer', 'Meters: Reset'
'Mixer', 'Pre/Post'
'Mixer', 'Q-Link'
'Mixer', 'Hide: Reveal All'
'Mixer', 'Show/Hide Channel Overview'
'Mixer', 'Section: Extended'
'Mixer', 'Show/Hide Channel Selector'
'Mixer', 'Show/Hide Control Room/Meter'
'Mixer', 'Show/Hide Equalizer Curve'
'Mixer', 'Show/Hide Meter Bridge'
'Mixer', 'Show/Hide Notepad'
'Mixer', 'Show/Hide Pictures'
'Mixer', 'Show: EQs'
'Mixer', 'Show: Sends'
'Mixer', 'Unlink Channels'
'Mixer', 'Views: Channel Strip'
'Mixer', 'Views: Cue Sends'
'Mixer', 'Views: Device Panels'
'Mixer', 'Views: Direct Routing'
'Mixer', 'Views: EQs'
'Mixer', 'Views: Filters/Gain'
'Mixer', 'Views: Inserts'
'Mixer', 'Views: Quick Controls'
'Mixer', 'Views: Routing'
'Mixer', 'Views: Sends'
'Mixer', 'Views: VCA'
'Mixer', 'Windows: Close All Plug-Ins'
'Mixer', 'Zoom In'
'Mixer', 'Zoom In Vertically'
'Mixer', 'Zoom Out'
'Mixer', 'Zoom Out Vertically'
'Navigate', 'Add Down'
'Navigate', 'Add Left'
'Navigate', 'Add Right'
'Navigate', 'Add Up'
'Navigate', 'Back'
'Navigate', 'Bottom'
'Navigate', 'Down'
'Navigate', 'Fore'
'Navigate', 'Left'
'Navigate', 'Less'
'Navigate', 'More'
'Navigate', 'Right'
'Navigate', 'Focus Previous Plug-in'
'Navigate', 'Focus Next Plug-in'
'Navigate', 'Toggle Selection'
'Navigate', 'Top'
'Navigate', 'Up'
'Note Expression', 'Consolidate Note Expression Overlaps'
'Note Expression', 'Convert to Note Expression'
'Note Expression', 'Dissolve Note Expression'
'Note Expression', 'Double-Click opens Note Expression Editor On/Off'
'Note Expression', 'Edit Next Parameter'
'Note Expression', 'Edit Previous Parameter'
'Note Expression', 'Editor Size: Decrease'
'Note Expression', 'Editor Size: Increase'
'Note Expression', 'Note Expression MIDI Setup'
'Note Expression', 'Open/Close Editor'
'Note Expression', 'Paste Note Expression'
'Note Expression', 'Record MIDI as Note Expression'
'Note Expression', 'Remove Note Expression'
'Note Expression', 'Resolve Note Expression'
'Note Expression', 'Show/Hide Note Expression Data'
'Note Expression', 'Trim Note Expression to Note Length'
'Nudge', 'Down'
'Nudge', 'Down More'
'Nudge', 'Graphical Bottom'
'Nudge', 'Graphical Left'
'Nudge', 'Graphical Right'
'Nudge', 'Graphical Top'
'Nudge', 'Left'
'Nudge', 'Link to Grid On/Off'
'Nudge', 'Loop Range Left'
'Nudge', 'Loop Range Right'
'Nudge', 'Bottom Down'
'Nudge', 'Bottom Up'
'Nudge', 'End Left'
'Nudge', 'End Right'
'Nudge', 'Start Left'
'Nudge', 'Start Right'
'Nudge', 'Top Down'
'Nudge', 'Top Up'
'Nudge', 'Right'
'Nudge', 'Select Next Grid Type Value'
'Nudge', 'Select Next Time Format'
'Nudge', 'Select Prev Grid Type Value'
'Nudge', 'Select Prev Time Format'
'Nudge', 'Up'
'Nudge', 'Up More'
'Preset', 'Next'
'Preset', 'Open/Close Browser'
'Preset', 'Previous'
'Preset', 'Track Preset: Next'
'Preset', 'Track Preset: Open Browser'
'Preset', 'Track Preset: Previous'
'Process', 'Envelope'
'Process', 'Fade In'
'Process', 'Fade Out'
'Process', 'Gain'
'Process', 'Invert Phase'
'Process', 'Normalize'
'Process', 'Pitch Shift'
'Process', 'Remove DC Offset'
'Process', 'Resample'
'Process', 'Reverse'
'Process', 'Silence'
'Process', 'Stereo Flip'
'Process', 'Time Stretch'
'Project', 'Auto Fades Settings'
'Project', 'Beat Calculator'
'Project', 'Bring To Front'
'Project', 'Colors'
'Project', 'Divide Track List'
'Project', 'Duplicate Tracks'
'Project', 'Folding: Fold Tracks'
'Project', 'Folding: Toggle Selected Track'
'Project', 'Folding: Toggle Tracks'
'Project', 'Folding: Unfold Tracks'
'Project', 'Folding: Tracks To Folder'
'Project', 'Notepad'
'Project', 'Open Browser'
'Project', 'Open Score Layout'
'Project', 'Open Markers'
'Project', 'Open Pool'
'Project', 'Open Tempo Track'
'Project', 'Remove Empty Tracks'
'Project', 'Remove Selected Tracks'
'Project', 'Select Track: Add Next'
'Project', 'Select Track: Add Prev'
'Project', 'Select Track: Next'
'Project', 'Select Track: Prev'
'Project', 'Set Timecode'
'Project', 'Set Track/Event Color'
'Project', 'Setup'
'Project', 'Tempo Detection'
'Project', 'Track Controls Settings'
'Quantize Category', 'AudioWarp Quantize On/Off'
'Quantize Category', 'Auto Quantize On/Off'
'Quantize Category', 'Create Groove Quantize Preset'
'Quantize Category', 'Freeze Quantize'
'Quantize Category', 'Quantize'
'Quantize Category', 'Quantize Ends'
'Quantize Category', 'Quantize Lengths'
'Quantize Category', 'Quantize Setup'
'Quantize Category', 'Undo Quantize'
'Quantize Category', 'Select Next Quantize'
'Quantize Category', 'Select Prev Quantize'
'Quantize Category', 'Set Quantize to 128th'
'Quantize Category', 'Set Quantize to 16th'
'Quantize Category', 'Set Quantize to 1th'
'Quantize Category', 'Set Quantize to 2th'
'Quantize Category', 'Set Quantize to 32th'
'Quantize Category', 'Set Quantize to 4th'
'Quantize Category', 'Set Quantize to 64th'
'Quantize Category', 'Set Quantize to 8th'
'Quantize Category', 'Iterative Quantize'
'Quantize Category', 'Toggle Quantize Dotted'
'Quantize Category', 'Toggle Quantize Triplet'
'Render in Place', 'Render'
'Render in Place', 'Render Setup...'
'Sample Editor', 'Bypass Warping'
'Sample Editor', 'VariAudio - Reanalyze'
'Sample Editor', 'VariAudio - Bypass Pitching'
'Sample Editor', 'VariAudio - Quantize Pitch'
'Sample Editor', 'VariAudio - Extract MIDI (no Dialog)'
'Sample Editor', 'VariAudio - Extract MIDI...'
'Sample Editor', 'VariAudio - Reset Pitch + Warp Changes'
'Sample Editor', 'VariAudio - Reset Formant Shift Changes'
'Sample Editor', 'VariAudio - Reset Pitch Changes'
'Sample Editor', 'VariAudio - Reset Pitch Curve Changes'
'Sample Editor', 'VariAudio - Reset Volume Changes'
'Sample Editor', 'VariAudio - Reset Warp Changes'
'Sample Editor', 'VariAudio - Show MIDI Reference Track'
'Sample Editor', 'VariAudio - Toggle Pitch Snap Mode'
'Sample Editor', 'VariAudio - Toggle Smart Control Mode'
'Sample Editor', 'Zoom Mode: Clip-Based'
'Sample Editor', 'Zoom Mode: Global'
'Score Align Elements', 'bottom'
'Score Align Elements', 'horizontal'
'Score Align Elements', 'vertical'
'Score Align Elements', 'dynamics'
'Score Align Elements', 'left'
'Score Align Elements', 'right'
'Score Align Elements', 'top'
'Score Functions', '3 pagemode zoom'
'Score Functions', '4 pagemode zoom'
'Score Functions', '5 pagemode zoom'
'Score Functions', '6 pagemode zoom'
'Score Functions', '7 pagemode zoom'
'Score Functions', '1 pagemode zoom'
'Score Functions', '8 pagemode zoom'
'Score Functions', '2 pagemode zoom'
'Score Functions', '1 set font set'
'Score Functions', '2 set font set'
'Score Functions', '3 set font set'
'Score Functions', '4 set font set'
'Score Functions', '5 set font set'
'Score Functions', '6 set font set'
'Score Functions', '7 set font set'
'Score Functions', '8 set font set'
'Score Functions', '9 set font set'
'Score Functions', '10 set font set'
'Score Functions', '11 set font set'
'Score Functions', '12 set font set'
'Score Functions', '13 set font set'
'Score Functions', '14 set font set'
'Score Functions', '15 set font set'
'Score Functions', '16 set font set'
'Score Functions', 'auto dialog'
'Score Functions', '8 auto layout'
'Score Functions', '7 auto layout'
'Score Functions', '6 auto layout'
'Score Functions', '1 auto layout'
'Score Functions', '3 auto layout'
'Score Functions', '0 auto layout'
'Score Functions', '2 auto layout'
'Score Functions', '9 auto layout'
'Score Functions', '5 auto layout'
'Score Functions', '4 auto layout'
'Score Functions', 'make accel'
'Score Functions', 'tuplet dialog'
'Score Functions', 'make repeat'
'Score Functions', 'make trill'
'Score Functions', 'CB-EmptyBar'
'Score Functions', 'grace note'
'Score Functions', 'show marker'
'Score Functions', 'Enharm Shift #'
'Score Functions', 'Enharm Shift ##'
'Score Functions', 'Enharm Shift ()'
'Score Functions', 'Enharm Shift ?'
'Score Functions', 'Enharm Shift b'
'Score Functions', 'Enharm Shift bb'
'Score Functions', 'Enharm Shift no'
'Score Functions', 'Enharm Shift off'
'Score Functions', 'xplode'
'Score Functions', 'extract voices'
'Score Functions', 'flip'
'Score Functions', 'force update'
'Score Functions', 'get info'
'Score Functions', 'group'
'Score Functions', 'hide'
'Score Functions', 'insert slur'
'Score Functions', '1 set insert'
'Score Functions', '2 set insert'
'Score Functions', '3 set insert'
'Score Functions', '4 set insert'
'Score Functions', '+ move insert'
'Score Functions', '- move insert'
'Score Functions', 'make chords'
'Score Functions', 'marker to form'
'Score Functions', 'merge staves'
'Score Functions', '1 to string'
'Score Functions', '2 to string'
'Score Functions', '3 to string'
'Score Functions', '4 to string'
'Score Functions', '5 to string'
'Score Functions', '6 to string'
'Score Functions', '7 to string'
'Score Functions', '8 to string'
'Score Functions', '9 to string'
'Score Functions', '10 to string'
'Score Functions', '11 to string'
'Score Functions', '12 to string'
'Score Functions', '1 to voice'
'Score Functions', '2 to voice'
'Score Functions', '3 to voice'
'Score Functions', '4 to voice'
'Score Functions', '5 to voice'
'Score Functions', '6 to voice'
'Score Functions', '7 to voice'
'Score Functions', '8 to voice'
'Score Functions', 'open numbars'
'Score Functions', '- move one'
'Score Functions', '+ move one'
'Score Functions', 'paste attr'
'Score Functions', 'show pos'
'Score Functions', 'clean layout'
'Score Functions', 'freeze scores'
'Score Functions', 'CB-ShowRepeat'
'Score Functions', 'show chordtrack'
'Score Functions', 'CB-RemoveRhythm'
'Score Functions', 'CB-ShowRhythm'
'Score Functions', 'spacer to layout'
'Score Functions', '1 to verse'
'Score Functions', '2 to verse'
'Score Functions', '3 to verse'
'Score Functions', '4 to verse'
'Score Functions', '5 to verse'
'Score Functions', '6 to verse'
'Score Meter Scale', '3 pagemode zoom'
'Score Meter Scale', '4 pagemode zoom'
'Score Meter Scale', '5 pagemode zoom'
'Score Meter Scale', '6 pagemode zoom'
'Score Meter Scale', '7 pagemode zoom'
'Score Meter Scale', '1 pagemode zoom'
'Score Meter Scale', '8 pagemode zoom'
'Score Meter Scale', '2 pagemode zoom'
'Score Meter Scale', 'rulerCM'
'Score Meter Scale', '100 edmode zoom'
'Score Meter Scale', '150 edmode zoom'
'Score Meter Scale', '200 edmode zoom'
'Score Meter Scale', '50 edmode zoom'
'Score Meter Scale', '80 edmode zoom'
'Score Meter Scale', 'fitPage'
'Score Meter Scale', 'fitWidth'
'Score Meter Scale', 'edmode hide'
'Score Meter Scale', 'rulerIN'
'Score Meter Scale', 'rulerOFF'
'Score Meter Scale', 'rulerPT'
'Score Symbol Editor', '100%'
'Score Symbol Editor', '200%'
'Score Symbol Editor', '400%'
'Score Symbol Editor', '600%'
'Score Symbol Editor', '800%'
'Score Symbol Editor', 'align bottom'
'Score Symbol Editor', 'align horizontal'
'Score Symbol Editor', 'align vertical'
'Score Symbol Editor', 'align left'
'Score Symbol Editor', 'align right'
'Score Symbol Editor', 'align top'
'Score Symbol Editor', 'move front'
'Score Symbol Editor', 'mirror 90 +'
'Score Symbol Editor', 'mirror 90 -'
'Score Symbol Editor', 'group'
'Score Symbol Editor', 'mirror horizontal'
'Score Symbol Editor', 'mirror vertical'
'Score Symbol Editor', 'move behind'
'Score Symbol Editor', 'ungroup'
'Score Symbol Palettes', 'palette chord'
'Score Symbol Palettes', 'palette clefs'
'Score Symbol Palettes', 'palette clef'
'Score Symbol Palettes', 'dynamic mapping'
'Score Symbol Palettes', 'palette dyn'
'Score Symbol Palettes', 'palette expressionmap'
'Score Symbol Palettes', 'palette user'
'Score Symbol Palettes', 'form symbols'
'Score Symbol Palettes', 'palette guitar'
'Score Symbol Palettes', 'palette keys'
'Score Symbol Palettes', 'palette linetr'
'Score Symbol Palettes', 'palette notesyms'
'Score Symbol Palettes', 'palette other'
'Score Symbol Palettes', 'palette sign'
'Score Symbol Palettes', 'palette picts'
'Score Symbol Palettes', 'palette text'
'Scores', 'auto group'
'Scores', 'Show/Hide Computer Keyboard Input'
'Scores', 'find replace'
'Scores', 'lyrics from clip'
'Scores', 'move next page'
'Scores', 'move prev page'
'Scores', 'Show/Hide Length'
'Scores', 'Toggle Mode'
'Scores', 'toggle inpector'
'Scores', 'global'
'Scores', 'staff set'
'Scores', 'text from clip'
'Scores', 'user symbols'
'Scores Statusbar', 'barhandles'
'Scores Statusbar', 'cut'
'Scores Statusbar', 'group'
'Scores Statusbar', 'hidden notes'
'Scores Statusbar', 'hide'
'Scores Statusbar', 'layout'
'Scores Statusbar', 'quant'
'Scores Statusbar', 'splitrest'
'Scores Statusbar', 'stems'
'Set Insert Length', '1'
'Set Insert Length', '2'
'Set Insert Length', '4'
'Set Insert Length', '8'
'Set Insert Length', '16'
'Set Insert Length', '32'
'Set Insert Length', '64'
'Set Insert Length', '128'
'Set Insert Length', '.'
'Set Insert Length', 'T'
'Tool', 'Audio Tempo Definition Tool'
'Tool', 'Color Tool'
'Tool', 'Combine Selection Tools On/Off'
'Tool', 'Comp Tool'
'Tool', 'Curve Tool'
'Tool', 'Cut Tool'
'Tool', 'Display Quantize Tool'
'Tool', 'Draw Tool'
'Tool', 'Drumstick Tool'
'Tool', 'Delete Tool'
'Tool', 'Export Range Tool'
'Tool', 'Free Warp Tool'
'Tool', 'Glue Tool'
'Tool', 'Hitpoint Tool'
'Tool', 'Insert Note Tool'
'Tool', 'Layout Tool'
'Tool', 'Mute Tool'
'Tool', 'Next Tool'
'Tool', 'Select Tool'
'Tool', 'Object Selection Tool: Normal Sizing'
'Tool', 'Object Selection Tool: Sizing Applies Time Stretch'
'Tool', 'Object Selection Tool: Sizing Moves Content'
'Tool', 'Play Tool'
'Tool', 'Popup Tools'
'Tool', 'Previous Tool'
'Tool', 'Range Tool'
'Tool', 'Score Zoom Tool'
'Tool', 'Scrub Tool'
'Tool', 'Split Tool'
'Tool', 'TimeWarp Tool'
'Tool', 'Tool 1'
'Tool', 'Tool 2'
'Tool', 'Tool 3'
'Tool', 'Tool 4'
'Tool', 'Tool 5'
'Tool', 'Tool 6'
'Tool', 'Tool 7'
'Tool', 'Tool 8'
'Tool', 'Tool 9'
'Tool', 'Tool 10'
'Tool', 'Trim Tool'
'Tool', 'Edit Pitch/Warp Tool'
'Tool', 'Zoom Tool'
'TrackVersions', 'Assign Common Version ID'
'TrackVersions', 'Create Lanes from Versions'
'TrackVersions', 'Create Versions from Lanes'
'TrackVersions', 'Delete Inactive Versions of All Tracks'
'TrackVersions', 'Delete Inactive Versions of Selected Tracks'
'TrackVersions', 'Delete Version'
'TrackVersions', 'Duplicate Version'
'TrackVersions', 'New Version'
'TrackVersions', 'Next Version'
'TrackVersions', 'Previous Version'
'TrackVersions', 'Rename Version'
'TrackVersions', 'Select Tracks with Same Version ID'
'Transport', 'Use External Sync'
'Transport', 'Metronome On'
'Transport', 'Auto Punch In'
'Transport', 'Auto Punch Out'
'Transport', 'Audio Record Mode'
'Transport', 'MIDI Record Auto Quantize'
'Transport', 'Cycle'
'Transport', 'Input Left Locator'
'Transport', 'Input Locator Duration'
'Transport', 'Input Position'
'Transport', 'Input Punch In Position'
'Transport', 'Input Punch Out Position'
'Transport', 'Input Right Locator'
'Transport', 'Input Tempo'
'Transport', 'Input Time Signature'
'Transport', 'Exchange Locator Positions'
'Transport', 'Exchange Time Formats'
'Transport', 'Fast Forward'
'Transport', 'Fast Rewind'
'Transport', 'Forward'
'Transport', 'To Left Locator'
'Transport', 'Goto End'
'Transport', 'Return to Zero'
'Transport', 'To Punch In Position'
'Transport', 'To Punch Out Position'
'Transport', 'To Right Locator'
'Transport', 'Insert Cycle Marker'
'Transport', 'Insert Marker'
'Transport', 'Jog Left'
'Transport', 'Jog Right'
'Transport', 'Locate Next Event'
'Transport', 'Locate Next Hitpoint'
'Transport', 'Locate Next Marker'
'Transport', 'Locate Previous Event'
'Transport', 'Locate Previous Hitpoint'
'Transport', 'Locate Previous Marker'
'Transport', 'Locate Selection End'
'Transport', 'Locate Selection'
'Transport', 'Locators to Selection'
'Transport', 'Sync Punch To Cycle'
'Transport', 'Lock Record'
'Transport', 'Loop Selection'
'Transport', 'MIDI Cycle Record Mode'
'Transport', 'MIDI Record Mode'
'Transport', 'MIDI Retrospective Record: Empty All Buffers'
'Transport', 'Global Retrospective Record'
'Transport', 'MIDI Retrospective Record: Insert from Track Input as Cycle Recording'
'Transport', 'MIDI Retrospective Record: Insert from Track Input as Linear Recording'
'Transport', 'Metronome Setup'
'Transport', 'Step Bar'
'Transport', 'Nudge +1 Frame'
'Transport', 'Step Back Bar'
'Transport', 'Nudge -1 Frame'
'Transport', 'Nudge Cursor +10 Seconds'
'Transport', 'Nudge Cursor +20 Seconds'
'Transport', 'Nudge Cursor +5 Seconds'
'Transport', 'Nudge Cursor -10 Seconds'
'Transport', 'Nudge Cursor -20 Seconds'
'Transport', 'Nudge Cursor -5 Seconds'
'Transport', 'Nudge Cursor Left'
'Transport', 'Nudge Cursor Right'
'Transport', 'Panel'
'Transport', 'Play Selection Range'
'Transport', 'Play from Selection End'
'Transport', 'Play from Selection Start'
'Transport', 'Play until Next Marker'
'Transport', 'Play until Selection End'
'Transport', 'Play until Selection Start'
'Transport', 'Post-roll from Selection End'
'Transport', 'Post-roll from Selection Start'
'Transport', 'Pre-roll to Selection End'
'Transport', 'Pre-roll to Selection Start'
'Transport', 'Project Synchronization Setup'
'Transport', 'Recall Cycle Marker 1'
'Transport', 'Recall Cycle Marker 2'
'Transport', 'Recall Cycle Marker 3'
'Transport', 'Recall Cycle Marker 4'
'Transport', 'Recall Cycle Marker 5'
'Transport', 'Recall Cycle Marker 6'
'Transport', 'Recall Cycle Marker 7'
'Transport', 'Recall Cycle Marker 8'
'Transport', 'Recall Cycle Marker 9'
'Transport', 'Recall Cycle Marker X'
'Transport', 'Record'
'Transport', 'Re-Record on/off'
'Transport', 'Start Record at Left Locator'
'Transport', 'Restart'
'Transport', 'Return to Start Position'
'Transport', 'Rewind'
'Transport', 'Set Left Locator'
'Transport', 'Set Marker 1'
'Transport', 'Set Marker 2'
'Transport', 'Set Marker 3'
'Transport', 'Set Marker 4'
'Transport', 'Set Marker 5'
'Transport', 'Set Marker 6'
'Transport', 'Set Marker 7'
'Transport', 'Set Marker 8'
'Transport', 'Set Marker 9'
'Transport', 'Set Punch In Position'
'Transport', 'Set Punch Out Position'
'Transport', 'Set Punch Points To Selection'
'Transport', 'Set Right Locator'
'Transport', 'Shuttle Play 1/2x'
'Transport', 'Shuttle Play 1/4x'
'Transport', 'Shuttle Play 1/8x'
'Transport', 'Shuttle Play 1x'
'Transport', 'Shuttle Play 2x'
'Transport', 'Shuttle Play 4x'
'Transport', 'Shuttle Play 8x'
'Transport', 'Shuttle Play Reverse 1/2x'
'Transport', 'Shuttle Play Reverse 1/4x'
'Transport', 'Shuttle Play Reverse 1/8x'
'Transport', 'Shuttle Play Reverse 1x'
'Transport', 'Shuttle Play Reverse 2x'
'Transport', 'Shuttle Play Reverse 4x'
'Transport', 'Shuttle Play Reverse 8x'
'Transport', 'Start'
'Transport', 'StartStop'
'Transport', 'StartStop Preview'
'Transport', 'Stop'
'Transport', 'To Cycle Marker 1'
'Transport', 'To Cycle Marker 2'
'Transport', 'To Cycle Marker 3'
'Transport', 'To Cycle Marker 4'
'Transport', 'To Cycle Marker 5'
'Transport', 'To Cycle Marker 6'
'Transport', 'To Cycle Marker 7'
'Transport', 'To Cycle Marker 8'
'Transport', 'To Cycle Marker 9'
'Transport', 'To Cycle Marker X'
'Transport', 'To Marker 1'
'Transport', 'To Marker 2'
'Transport', 'To Marker 3'
'Transport', 'To Marker 4'
'Transport', 'To Marker 5'
'Transport', 'To Marker 6'
'Transport', 'To Marker 7'
'Transport', 'To Marker 8'
'Transport', 'To Marker 9'
'Transport', 'To Marker X'
'Transport', 'Toggle: Cycle follows when locating to Markers'
'Transport', 'Unlock Record'
'Transport', 'Use Post-roll'
'Transport', 'Use Pre-/Post-Roll'
'Transport', 'Use Pre-roll'
'Transport', 'Precount On'
'Transport', 'Tempo Track Rehearsal Mode On/Off'
'Transport', 'Edit Mode'
'VRPlayerRemote', 'Show Dialog'
'Video', 'Mute all video tracks'
'Window Zones', 'Show Next Page'
'Window Zones', 'Show Next Tab'
'Window Zones', 'Show Previous Page'
'Window Zones', 'Show Previous Tab'
'Window Zones', 'Show/Hide Infoview'
'Window Zones', 'Show/Hide Left Zone'
'Window Zones', 'Show/Hide Lower Zone'
'Window Zones', 'Show/Hide Overview'
'Window Zones', 'Show/Hide Regions'
'Window Zones', 'Show/Hide Right Zone'
'Window Zones', 'Show/Hide Status Line'
'Window Zones', 'Show/Hide Transport Zone'
'Window Zones', 'Show/Hide Upper Zone'
'Windows', 'Close All'
'Windows', 'Close All Plug-in Windows'
'Windows', 'Maximize'
'Windows', 'Minimize'
'Windows', 'Minimize All'
'Windows', 'Restore All'
'Windows', 'Select Next Plug-in Window'
'Windows', 'Show/Hide Desktop'
'Windows', 'Show/Hide Plug-ins'
'Workspaces', 'New'
'Workspaces', 'No Workspace'
'Workspaces', 'Organize'
'Workspaces', 'Update Workspace'
'Workspaces', 'Workspace 1'
'Workspaces', 'Workspace 2'
'Workspaces', 'Workspace 3'
'Workspaces', 'Workspace 4'
'Workspaces', 'Workspace 5'
'Workspaces', 'Workspace 6'
'Workspaces', 'Workspace 7'
'Workspaces', 'Workspace 8'
'Workspaces', 'Workspace 9'
'Workspaces', 'Workspace X'
'Zoom', 'Redo Zoom'
'Zoom', 'Undo Zoom'
'Zoom', 'Zoom 4 Tracks'
'Zoom', 'Zoom 8 Tracks'
'Zoom', 'Zoom Cycle Marker 1'
'Zoom', 'Zoom Cycle Marker 2'
'Zoom', 'Zoom Cycle Marker 3'
'Zoom', 'Zoom Cycle Marker 4'
'Zoom', 'Zoom Cycle Marker 5'
'Zoom', 'Zoom Cycle Marker 6'
'Zoom', 'Zoom Cycle Marker 7'
'Zoom', 'Zoom Cycle Marker 8'
'Zoom', 'Zoom Cycle Marker 9'
'Zoom', 'Zoom Full'
'Zoom', 'Zoom In'
'Zoom', 'Zoom In On Waveform Vertically'
'Zoom', 'Zoom In Tracks'
'Zoom', 'Zoom In Vertically'
'Zoom', 'Zoom MEM'
'Zoom', 'Zoom N Tracks'
'Zoom', 'Zoom Out'
'Zoom', 'Zoom Out Of Waveform Vertically'
'Zoom', 'Zoom Out Tracks'
'Zoom', 'Zoom Out Vertically'
'Zoom', 'Zoom Preset 1'
'Zoom', 'Zoom Preset 2'
'Zoom', 'Zoom Preset 3'
'Zoom', 'Zoom Preset 4'
'Zoom', 'Zoom Preset 5'
'Zoom', 'Zoom Tracks 1 Row'
'Zoom', 'Zoom Tracks 2 Rows'
'Zoom', 'Zoom Tracks 3 Rows'
'Zoom', 'Zoom Tracks 4 Rows'
'Zoom', 'Zoom Tracks Exclusive'
'Zoom', 'Zoom Tracks Full'
'Zoom', 'Zoom Tracks Minimal'
'Zoom', 'Zoom Tracks N Rows'
'Zoom', 'Zoom ZAP'
'Zoom', 'Zoom to Event'
'Zoom', 'Zoom to Locators'
'Zoom', 'Zoom to Selection'
'Zoom', 'Zoom to Selection Horizontally'

*/

var commandKeyBindings = [
    // channel, note, command group, command
    [0,0,'Zoom', 'Undo Zoom'],
    [0,1,'Zoom', 'Zoom Full'],
    [0,2,'Zoom', 'Zoom to Selection Horizontally'],
    [0,3,'Zoom', 'Zoom to Locators'],
    [0,4,'Zoom', 'Zoom Tracks 1 Row'],
    [0,5,'Zoom', 'Zoom Tracks 2 Rows'],
    [0,6,'Zoom', 'Zoom Tracks 3 Rows'],
    [0,7,'Zoom', 'Zoom Tracks 4 Rows'],
    [0,8,'Transport', 'To Left Locator'],
    [0,9,'Transport', 'Play from Selection Start'],
    [0,10,'Transport', 'Use Pre-roll'],
    [0,11,'Quantize Category', 'Set Quantize to 16th'],
    [0,12,'Quantize Category', 'Set Quantize to 8th'],
    [0,13,'Quantize Category', 'Set Quantize to 4th'],
    [0,14,'Quantize Category', 'Quantize'],
    [0,15,'Quantize Category', 'Iterative Quantize'],
    [0,16,'Quantize Category', 'Quantize Setup'],
    [0,17,'Quantize Category', 'Undo Quantize'],
    [0,18,'Transport', 'Metronome On'],
    [0,19,'Render in Place', 'Render'],
    [0,20,'Render in Place', 'Render Setup...'],
    [0,21,'Project', 'Duplicate Tracks'],
    [0,22,'Project', 'Set Track/Event Color'],
    [0,23,'Project', 'Folding: Toggle Selected Track'],
    [0,24,'Project', 'Folding: Fold Tracks'],
    [0,25,'Project', 'Folding: Unfold Tracks'],
    [0,26,'Nudge', 'Link to Grid On/Off'],
    [0,30,'Edit', 'Autoscroll'],
    [0,31,'Edit', 'Edit Channel Settings'],
    [0,32,'Edit', 'Edit VST Instrument'],
    [0,33,'Edit', 'Mute/Unmute Objects'],
    [0,34,'Edit', 'Solo'],
    [0,35,'Edit', 'Deactivate All Solo'],
    [0,36,'Edit', 'Acoustic Feedback On/Off'],
    [0,37,'Edit', 'Select All on Tracks'],
    [0,38,'Edit', 'Grid Type: Bar'],
    [0,39,'Edit', 'Grid Type: Adapt to Zoom'],
    [0,40,'Sample Editor', 'VariAudio - Reanalyze'],
    [0,41,'Sample Editor', 'VariAudio - Quantize Pitch'],
    [0,50,'Tool', 'Object Selection Tool: Normal Sizing'],
    [0,51,'Inspector', 'Toggle Inserts Section'],
    [0,60,'AddTrack', 'Audio'],
    [0,61,'AddTrack', 'Instrument'],
    [0,62,'AddTrack', 'Group Channel'],
    [0,63,'AddTrack', 'FX Channel'],
    [0,64,'AddTrack', 'From Track Presets'],
    [0,70,'Editors', 'Open/Close Editor'],
    [0,71,'Note Expression', 'Convert to Note Expression'],
    [0,72,'Process Logical Preset', 'Select downbeat 4th'],
    [0,80,'File', 'Import Tracks from Project'],
    [0,81,'File', 'Export Audio Mixdown'],
    [0,82,'MIDI Remote', 'Scripting Tools: Reload Scripts'],
    [0,83, 'Devices', 'Setup'],
    [0,90, 'Audio', 'Crossfade'],
    [0,91, 'Audio', 'Open Fade Editors'],
    [0,92, 'Audio', 'Remove Fades'],
    [0,93, 'Audio', 'Delete Overlaps'],
]

var mockEndlessKeyBindings = [
    // channel, cc, left command group, left command, right command group, right command
    [0, 0, 'Zoom', 'Zoom Out', 'Zoom', 'Zoom In'],
    [0, 1, 'Zoom', 'Zoom Out Vertically', 'Zoom', 'Zoom In Vertically'],
    [0, 2, 'Zoom', 'Zoom Out Tracks', 'Zoom', 'Zoom In Tracks'],
    [0, 3, 'Project', 'Select Track: Prev', 'Project', 'Select Track: Next'],
    [0, 4, 'Project', 'Select Track: Add Prev', 'Project', 'Select Track: Add Next'],
    [0, 5, 'Quantize Category', 'Select Prev Quantize',    'Quantize Category', 'Select Next Quantize'],
    [0, 6, 'Tool', 'Previous Tool', 'Tool', 'Next Tool'],
    [0, 7, 'Note Expression', 'Edit Previous Parameter', 'Note Expression', 'Edit Next Parameter'],
    [0, 8, 'Mixer', 'Control Link: Previous Control Link Group', 'Mixer', 'Control Link: Next Control Link Group'],
    [0, 9, 'Inspector', 'Open Previous Section', 'Inspector', 'Open Next Section'],
    [0, 10, 'Edit', 'Range to Previous Event', 'Edit', 'Range to Next Event'],
    [0, 11, 'Edit', 'Enlarge Range to Previous Event', 'Edit', 'Enlarge Range to Next Event'],
    [0, 12, 'Edit', 'Activate Previous Part', 'Edit', 'Activate Next Part'],
    [0, 13, 'Navigate', 'Down', 'Navigate', 'Up'],
    [0, 14, 'Navigate', 'Left', 'Navigate', 'Right'],
    [0, 15, 'Navigate', 'Add Left', 'Navigate', 'Add Right'],
    [0, 16, 'Navigate', 'Add Down', 'Navigate', 'Add Up'],
    [0, 17, 'Edit', 'Undo', 'Edit', 'Redo'],
    [0, 18, 'Audio', 'Decrement Event Volume', 'Audio', 'Increment Event Volume'],
    [0, 19, 'Audio', 'Decrement Fade In Length', 'Audio', 'Increment Fade In Length'],
    [0, 20, 'Audio', 'Increment Fade Out Length', 'Audio', 'Decrement Fade Out Length'],
    [0, 21, 'Transport', 'Locate Previous Event', 'Transport', 'Locate Next Event'],
    [0, 22, 'Transport', 'Locate Previous Hitpoint', 'Transport', 'Locate Next Hitpoint'],
    [0, 23, 'Transport', 'Locate Previous Marker', 'Transport', 'Locate Next Marker'],
    [0, 24, 'Transport', 'Step Back Bar', 'Transport', 'Step Bar'],
    [0, 25, 'Transport', 'Nudge Cursor Left', 'Transport', 'Nudge Cursor Right'],
    [0, 26, 'Transport', 'Jog Left', 'Transport', 'Jog Right'],
    [0, 27, 'Nudge', 'Loop Range Left', 'Nudge', 'Loop Range Right'],
    [0, 28, 'Nudge', 'Left', 'Nudge', 'Right'],
    [0, 29, 'Nudge', 'Select Prev Time Format', 'Nudge', 'Select Next Time Format'],
    [0, 30, 'Nudge', 'Select Prev Grid Type Value', 'Nudge', 'Select Next Grid Type Value'],
    [0, 66, 'Process Logical Preset', 'MG000_Velocity_-1', 'Process Logical Preset', 'MG004_Velocity_+1'],
    [0, 67, 'Process Logical Preset', 'MG002_Velocity_-5', 'Process Logical Preset', 'MG006_Velocity_+5'],
    [0, 68, 'Process Logical Preset', 'MG022_Velocity_Compress', 'Process Logical Preset', 'MG021_Velocity_Expand'],
    [0, 69, 'Process Logical Preset', 'MG267_Transpose-12', 'Process Logical Preset', 'MG268_Transpose+12'],
]

var categorySwitches = [
    [0, 64, [
        ['MIDI', 'Controller Lane Setup 1'],
        ['MIDI', 'Controller Lane Setup 2'],
        ['MIDI', 'Controller Lane Setup 3'],
        ['MIDI', 'Controller Lane Setup 4']
    ]],
    [0, 65, [
        ['Process Logical Preset', 'BB_Select_A_-_1st_Beat_Notes'],
        ['Process Logical Preset', 'BB_Select_C_-_1st_Beat_2nd_16th_notes'],
        ['Process Logical Preset', 'BB_Select_B_-_1st_Beat_2nd_8th_notes'],
        ['Process Logical Preset', 'BB_Select_C_-_1st_Beat_4th_16th_notes'],
        ['Process Logical Preset', 'BB_Select_A_-_2nd_Beat_Notes'],
        ['Process Logical Preset', 'BB_Select_C_-_2nd_Beat_2nd_16th_notes'],
        ['Process Logical Preset', 'BB_Select_B_-_2nd_Beat_2nd_8th_notes'],
        ['Process Logical Preset', 'BB_Select_C_-_2nd_Beat_4th_16th_notes'],
        ['Process Logical Preset', 'BB_Select_A_-_3rd_Beat_Notes'],
        ['Process Logical Preset', 'BB_Select_C_-_3rd_Beat_2nd_16th_notes'],
        ['Process Logical Preset', 'BB_Select_B_-_3rd_Beat_2nd_8th_notes'],
        ['Process Logical Preset', 'BB_Select_C_-_3rd_Beat_4th_16th_notes'],
        ['Process Logical Preset', 'BB_Select_A_-_4rd_Beat_Notes'],
        ['Process Logical Preset', 'BB_Select_C_-_4th_Beat_2nd_16th_notes'],
        ['Process Logical Preset', 'BB_Select_B_-_4th_Beat_2nd_8th_notes'],
        ['Process Logical Preset', 'BB_Select_C_-_4th_Beat_4th_16th_notes'],
    ]],
    [0, 70, [
        ['Process Logical Preset', 'BB_Select_Vel_0_10'],
        ['Process Logical Preset', 'BB_Select_Vel_0_20'],
        ['Process Logical Preset', 'BB_Select_Vel_0_30'],
        ['Process Logical Preset', 'BB_Select_Vel_0_40'],
        ['Process Logical Preset', 'BB_Select_Vel_0_50'],
        ['Process Logical Preset', 'BB_Select_Vel_0_60'],
        ['Process Logical Preset', 'BB_Select_Vel_0_70'],
        ['Process Logical Preset', 'BB_Select_Vel_0_80'],
        ['Process Logical Preset', 'BB_Select_Vel_0_90'],
        ['Process Logical Preset', 'BB_Select_Vel_0_100'],
        ['Process Logical Preset', 'BB_Select_Vel_0_110'],
        ['Process Logical Preset', 'BB_Select_Vel_0_120'],
        ['Process Logical Preset', 'BB_Select_Vel_0_127'],
    ]],
    [0, 71, [
        ['Process Logical Preset', 'BB_Select_Vel_0_127'],
        ['Process Logical Preset', 'BB_Select_Vel_10_127'],
        ['Process Logical Preset', 'BB_Select_Vel_20_127'],
        ['Process Logical Preset', 'BB_Select_Vel_30_127'],
        ['Process Logical Preset', 'BB_Select_Vel_40_127'],
        ['Process Logical Preset', 'BB_Select_Vel_50_127'],
        ['Process Logical Preset', 'BB_Select_Vel_60_127'],
        ['Process Logical Preset', 'BB_Select_Vel_70_127'],
        ['Process Logical Preset', 'BB_Select_Vel_80_127'],
        ['Process Logical Preset', 'BB_Select_Vel_90_127'],
        ['Process Logical Preset', 'BB_Select_Vel_100_127'],
        ['Process Logical Preset', 'BB_Select_Vel_110_127'],
        ['Process Logical Preset', 'BB_Select_Vel_120_127'],
    ]],
    [0, 72, [
        ['Process Logical Preset', 'BB_Select_Vel_60_70'],
        ['Process Logical Preset', 'BB_Select_Vel_50_80'],
        ['Process Logical Preset', 'BB_Select_Vel_40_90'],
        ['Process Logical Preset', 'BB_Select_Vel_30_100'],
        ['Process Logical Preset', 'BB_Select_Vel_20_110'],
        ['Process Logical Preset', 'BB_Select_Vel_10_120'],
        ['Process Logical Preset', 'BB_Select_Vel_0_127'],
    ]],
]

function makeEndless(x,z, ch, cc) {
    var ret = []

    for(var i=0; i< mockEndlessKeyBindings.length; i++) {
        var ch = mockEndlessKeyBindings[i][0]
        var cc = mockEndlessKeyBindings[i][1]
        var slider = {}
        slider.left = surface.makeButton(x+i,z,1,1)
        slider.right = surface.makeButton(x+i,z+1,1,1)
        slider.knob = surface.makeKnob(x+i, z+2, 1, 1)
        slider.knob.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(ch,cc)
        ret.push(slider)
    }
    
    return ret
}

function makeCategory(x,z, ch, cc) {
    var ret = []
    for(var i=0; i< categorySwitches.length; i++) {
        var ch = categorySwitches[i][0]
        var cc = categorySwitches[i][1]
        var cmds = categorySwitches[i][2]
        var slider = {}
        slider.knob = surface.makeKnob(x+i, z, 1, 1)
        slider.knob.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(ch,cc)
        var buttons = []
        for(var j=0; j < cmds.length; j++) {
            var btn = surface.makeButton(x+i, z+j+1, 1, 1)
            buttons.push(btn)
        }
        slider.buttons = buttons
        
        ret.push(slider)
    }
    
    return ret
}


function makeCommandKeys(x, y) {
    var command = {
        btn: []
    }

    var w = 2
    var h = 2

    var currX = x

    function bindMidiCC(button, chn, num) {
        button.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(chn, num)
    }

    function bindNote(button, chn, num) {
        button.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToNote(chn, num)
    }

    for (var i = 0; i < commandKeyBindings.length; i++) {
        var element = commandKeyBindings[i];
        var button = surface.makeButton(currX, y, w, h)
        bindNote(button, element[0], element[1])
        command.btn.push(button)
        currX = currX + w
    }

    return command
}

function makeSurfaceElements() {
    var surfaceElements = {}

    surfaceElements.btn_prevTrack = surface.makeButton(0, 7, 2, 1)
    surfaceElements.btn_prevTrack.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(15, 102)

    surfaceElements.btn_nextTrack = surface.makeButton(2, 7, 2, 1)
    surfaceElements.btn_nextTrack.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(15, 103)

    surfaceElements.btn_prevBinding = surface.makeButton(0, 3, 2, 1)
    surfaceElements.btn_prevBinding.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(15, 81)
    
    surfaceElements.btn_nextBinding = surface.makeButton(0, 4, 2, 1)
    surfaceElements.btn_nextBinding.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(15, 82)
    
    surfaceElements.btn_prevChannelBank = surface.makeButton(2, 3, 2, 1)
    surfaceElements.btn_prevChannelBank.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(15, 85)
    
    surfaceElements.btn_nextChannelBank = surface.makeButton(2, 4, 2, 1)
    surfaceElements.btn_nextChannelBank.mSurfaceValue.mMidiBinding.setInputPort(midiInput).bindToControlChange(15, 86)

    surfaceElements.numStrips = 1 // max: 8

    surfaceElements.knobStrips = {}
    surfaceElements.faderStrips = {}

    var xKnobStrip = 5
    var yKnobStrip = 0

    surfaceElements.knobStripBlindPanel = surface.makeBlindPanel(xKnobStrip, yKnobStrip + 2, surfaceElements.numStrips * 2, 2)

    for(var i = 0; i < surfaceElements.numStrips; ++i) {
        surfaceElements.knobStrips[i] = makeKnobStrip(i, xKnobStrip, yKnobStrip)
        surfaceElements.faderStrips[i] = makeFaderStrip(i, 24, 0)
    }

    surfaceElements.transport = makeTransport(41, 7)

    // surfaceElements.pianoKeys = surface.makePianoKeys(5, 10, 48, 7, 0, 48)

    surfaceElements.commandKeys = makeCommandKeys(5, 18)
    surfaceElements.endless = makeEndless(5, 20)
    surfaceElements.categorySwitches = makeCategory(5, 25)

    return surfaceElements
}

var surfaceElements = makeSurfaceElements()

function makeTransportDisplayFeedback(button, ledID, colorID) {
	button.mSurfaceValue.mOnProcessValueChange = function (context, newValue) {
		midiOutput.sendMidi(context, [ 0xbf, ledID, colorID * newValue ])
	}
}

// makeTransportDisplayFeedback(surfaceElements.transport.btnRewind, 112, 3)
// makeTransportDisplayFeedback(surfaceElements.transport.btnForward, 113, 3)
// makeTransportDisplayFeedback(surfaceElements.transport.btnStop, 114, 3)
// makeTransportDisplayFeedback(surfaceElements.transport.btnStart, 115, 21)
// makeTransportDisplayFeedback(surfaceElements.transport.btnCycle, 116, 49)
// makeTransportDisplayFeedback(surfaceElements.transport.btnRecord, 117, 5)

//-----------------------------------------------------------------------------
// 3. HOST MAPPING - create mapping pages and host bindings
//-----------------------------------------------------------------------------

function callbackClosure(i, callback) {
    // please Steinberg ES6!
    return function(dev, num) {
      return callback(i, dev, num);
    }
  }

var categoryState = {}

function makePageWithDefaults(name) {
    var page = deviceDriver.mMapping.makePage(name)

    page.makeActionBinding(surfaceElements.btn_prevTrack.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack)
    page.makeActionBinding(surfaceElements.btn_nextTrack.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack)

    page.makeValueBinding(surfaceElements.transport.btnRewind.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind)
    page.makeValueBinding(surfaceElements.transport.btnForward.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward)
    page.makeValueBinding(surfaceElements.transport.btnStop.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStop)
    page.makeValueBinding(surfaceElements.transport.btnStart.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStart)
    page.makeValueBinding(surfaceElements.transport.btnCycle.mSurfaceValue, page.mHostAccess.mTransport.mValue.mCycleActive)
    page.makeValueBinding(surfaceElements.transport.btnRecord.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRecord)
    page.makeValueBinding(surfaceElements.transport.btnMetronome.mSurfaceValue, page.mHostAccess.mTransport.mValue.mMetronomeActive)

    for (var i = 0; i < surfaceElements.commandKeys.btn.length; i++) {
        console.log('Binding ch=' + commandKeyBindings[i][0] + ' note=' + commandKeyBindings[i][1] + ' to command ' + commandKeyBindings[i][2] + ', '  + commandKeyBindings[i][3])
        page.makeCommandBinding(surfaceElements.commandKeys.btn[i].mSurfaceValue, commandKeyBindings[i][2], commandKeyBindings[i][3])    
    }
    for(var i = 0; i < surfaceElements.endless.length; i++) {
        console.log('setup' + i)
        var el = surfaceElements.endless[i]
        var ch = mockEndlessKeyBindings[i][0]
        var leftGroup = mockEndlessKeyBindings[i][2]
        var leftCmd = mockEndlessKeyBindings[i][3]
        var rightGroup = mockEndlessKeyBindings[i][4]
        var rightCmd = mockEndlessKeyBindings[i][5]
        page.makeCommandBinding(surfaceElements.endless[i].left.mSurfaceValue, leftGroup, leftCmd)
        page.makeCommandBinding(surfaceElements.endless[i].right.mSurfaceValue, rightGroup, rightCmd)
        surfaceElements.endless[i].knob.mSurfaceValue.mOnProcessValueChange = callbackClosure(i, function(i, dev, num) {
            var cc = mockEndlessKeyBindings[i][1]
            console.log(['process value change', i, num > 0.5 ? 'right' : 'left'].join(" "))
            var inVal = 0.5 > num ? 127 : 0;
            var outVal = 0.5 > num ? 0 : 127;
            surfaceElements.endless[i].left.mSurfaceValue.setProcessValue(dev, inVal)
            surfaceElements.endless[i].right.mSurfaceValue.setProcessValue(dev, outVal)
            var status = 0xB0 | ch
            midiOutput.sendMidi(dev, [status, cc, 64])
        })
    }
    for(var i = 0; i < surfaceElements.categorySwitches.length; i++) {
        
        for(var j=0; j < surfaceElements.categorySwitches[i].buttons.length; j++) {
            var cmds = categorySwitches[i][2]
            page.makeCommandBinding(surfaceElements.categorySwitches[i].buttons[j].mSurfaceValue, cmds[j][0], cmds[j][1])
        }
        surfaceElements.categorySwitches[i].knob.mSurfaceValue.mOnProcessValueChange = callbackClosure(i, function(i, dev, num) {
            var el  = surfaceElements.categorySwitches[i]
            var ch = categorySwitches[i][0]
            var cc = categorySwitches[i][1]
            var cmds = categorySwitches[i][2]
            if(!categoryState[i]) {
                categoryState[i] = 0
            }
            var inc = num > 0.5 ? 1 : -1
            var newState = (categoryState[i] + inc + cmds.length) % cmds.length
            console.log(['select ', i, inc, num, newState].join(" "))
            for( var j =0; j < el.buttons.length; j++) {
                if(j==newState) {
                    surfaceElements.categorySwitches[i].buttons[j].mSurfaceValue.setProcessValue(dev, 127)
                } else {
                    surfaceElements.categorySwitches[i].buttons[j].mSurfaceValue.setProcessValue(dev, 0)
                }
            }
            categoryState[i] = newState
            var status = 0xB0 | ch
            midiOutput.sendMidi(dev, [status, cc, 64])
        })
    }
    

    return page
}

function makeSubPage(subPageArea, name) {
    var subPage = subPageArea.makeSubPage(name)
    var msgText = 'sub page ' + name + ' activated'
    subPage.mOnActivate = function(activeDevice) {
        console.log(msgText)
    }
    return subPage
}

function makePageMixer() {
    var page = makePageWithDefaults('Mixer')

    var knobSubPageArea = page.makeSubPageArea('Knobs')

    var subPageVolume = makeSubPage(knobSubPageArea, 'Volume')
    var subPagePan = makeSubPage(knobSubPageArea, 'Pan')

    var subPageListSendLevel = []

    var numSendLevelSubPages = midiremote_api.mDefaults.getNumberOfSendSlots ()
    for(var subPageIdx = 0; subPageIdx < numSendLevelSubPages; ++subPageIdx) {
        var nameSubPage = 'Send Level ' + (subPageIdx + 1).toString()
        var subPageSendLevel = makeSubPage(knobSubPageArea, nameSubPage)
        subPageListSendLevel.push(subPageSendLevel)
    }

    var hostMixerBankZone = page.mHostAccess.mMixConsole.makeMixerBankZone()
        .excludeInputChannels()
        .excludeOutputChannels()

    page.makeActionBinding(surfaceElements.btn_prevChannelBank.mSurfaceValue, hostMixerBankZone.mAction.mPrevBank)
    page.makeActionBinding(surfaceElements.btn_nextChannelBank.mSurfaceValue, hostMixerBankZone.mAction.mNextBank)

    page.makeActionBinding(surfaceElements.btn_prevBinding.mSurfaceValue, knobSubPageArea.mAction.mPrev)
    page.makeActionBinding(surfaceElements.btn_nextBinding.mSurfaceValue, knobSubPageArea.mAction.mNext)

    function bindChannelBankItem(index) {
        var channelBankItem = hostMixerBankZone.makeMixerBankChannel()
        var inserts1 = channelBankItem.mInsertAndStripEffects.makeInsertEffectViewer('1')
        var inserts2 = channelBankItem.mInsertAndStripEffects.makeInsertEffectViewer('2')
        
        inserts1.mOnChangePluginIdentity = function(dev, map, arg2, arg3, arg4, arg5) {
            console.log(['plugin 1 change', arg2, arg3, arg4, arg5].join(" "))
        }

        inserts2.mOnChangePluginIdentity = function(dev, map, arg2, arg3, arg4, arg5) {
            console.log(['plugin 2 change', arg2, arg3, arg4, arg5].join(" "))
        }

        var knobValue = surfaceElements.knobStrips[index].knob.mSurfaceValue

        var muteValue = surfaceElements.faderStrips[index].btnMute.mSurfaceValue
        var soloValue = surfaceElements.faderStrips[index].btnSolo.mSurfaceValue
        var faderValue = surfaceElements.faderStrips[index].fader.mSurfaceValue
        var panValue = surfaceElements.faderStrips[index].pan.mSurfaceValue
        var automationRead = surfaceElements.faderStrips[index].btnAutomationRead.mSurfaceValue
        var automationWrite = surfaceElements.faderStrips[index].btnAutomationWrite.mSurfaceValue
        var monitorEnable = surfaceElements.faderStrips[index].btnMonitorEnable.mSurfaceValue
        var recordEnable = surfaceElements.faderStrips[index].btnRecordEnable.mSurfaceValue
        var send1 = surfaceElements.faderStrips[index].send1.mSurfaceValue
        var send2 = surfaceElements.faderStrips[index].send2.mSurfaceValue
        var send3 = surfaceElements.faderStrips[index].send3.mSurfaceValue
        var send4 = surfaceElements.faderStrips[index].send4.mSurfaceValue
        var insert1 = surfaceElements.faderStrips[index].insert1.mSurfaceValue
        var insert2 = surfaceElements.faderStrips[index].insert2.mSurfaceValue
        var insert2next = surfaceElements.faderStrips[index].insert2next
        var insert2reset = surfaceElements.faderStrips[index].insert2reset
        var insert3 = surfaceElements.faderStrips[index].insert3.mSurfaceValue
        var insert4 = surfaceElements.faderStrips[index].insert4.mSurfaceValue

        page.makeValueBinding (knobValue, channelBankItem.mValue.mVolume).setSubPage(subPageVolume).mOnValueChange = function (d, m, ch, val) {
            console.log('value change' + d + ' ' + m + ' ' + ch + ' ' + val)
        }
        page.makeValueBinding (knobValue, channelBankItem.mValue.mPan).setSubPage(subPagePan)

        for(var subPageIdx = 0; subPageIdx < numSendLevelSubPages; ++subPageIdx) {
            var sendLevel = channelBankItem.mSends.getByIndex(subPageIdx).mLevel
            var subPage = subPageListSendLevel[subPageIdx]
            page.makeValueBinding (knobValue, sendLevel).setSubPage(subPage)
        }

        page.makeValueBinding (muteValue, channelBankItem.mValue.mMute)
        page.makeValueBinding (soloValue, channelBankItem.mValue.mSolo)
        page.makeValueBinding (faderValue, channelBankItem.mValue.mVolume)
        page.makeValueBinding(panValue, channelBankItem.mValue.mPan)
        page.makeValueBinding(automationRead, channelBankItem.mValue.mAutomationRead)
        page.makeValueBinding(automationWrite, channelBankItem.mValue.mAutomationWrite)
        page.makeValueBinding(monitorEnable, channelBankItem.mValue.mMonitorEnable)
        page.makeValueBinding(recordEnable, channelBankItem.mValue.mRecordEnable)
        page.makeValueBinding(send1, channelBankItem.mSends.getByIndex(0).mLevel)
        page.makeValueBinding(send2, channelBankItem.mSends.getByIndex(1).mLevel)
        page.makeValueBinding(send3, channelBankItem.mSends.getByIndex(2).mLevel)
        page.makeValueBinding(send4, channelBankItem.mSends.getByIndex(3).mLevel)
        page.makeValueBinding(insert1, inserts1.mBypass)
        page.makeValueBinding(insert2, inserts2.mBypass)
        page.makeActionBinding(insert2reset, inserts2.mAction.mReset)
        page.makeActionBinding(insert2next, inserts2.mAction.mNext)
        channelBankItem.mOnTitleChange = function(dev) {
            console.log("change")
            insert2reset.setProcessValue(dev, 1)
            insert2next.setProcessValue(dev, 1)
        }
    }

    for(var i = 0; i < surfaceElements.numStrips; ++i)
        bindChannelBankItem(i)

    return page
}

function makePageSelectedTrack() {
    var page = makePageWithDefaults('Selected Track')

    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    selectedTrackChannel.mValue.mVolume

    for(var idx = 0; idx < surfaceElements.knobStrips.length; ++idx)
        page.makeValueBinding (surfaceElements.knobStrips[idx].knob.mSurfaceValue, selectedTrackChannel.mQuickControls.getByIndex(idx))
    
    return page
}

var pageMixer = makePageMixer()
var pageSelectedTrack = makePageSelectedTrack()

pageMixer.mOnActivate = function (context) {
	helper.display.reset(context, midiOutput)
	console.log('from script: RealWorldDevice page "Mixer" activated')
    // surfaceElements.faderStrips[0].insert2next.setProcessValue(context, 1)
}

pageSelectedTrack.mOnActivate = function (context) {
	helper.display.reset(context, midiOutput)
	console.log('from script: RealWorldDevice page "Selected Track" activated')
}