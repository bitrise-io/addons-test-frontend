import { Component, OnInit } from '@angular/core';
import { Log } from 'src/app/models/log.model';
import { LogLine, LogLineType } from 'src/app/models/log-line.model';

const INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES = 20;

@Component({
  selector: 'bitrise-test-suite-details-menu-logs',
  templateUrl: './test-suite-details-menu-logs.component.html',
  styleUrls: ['./test-suite-details-menu-logs.component.scss']
})

export class TestSuiteDetailsMenuLogsComponent implements OnInit {
  downloadLogURL: string;

  typeFilterItems = [{
    name: 'All Logs',
    acceptedTypes: null
  }, {
    name: 'Errors',
    acceptedTypes: [LogLineType.assert, LogLineType.error]
  }, {
    name: 'Warnings',
    acceptedTypes: [LogLineType.warning]
  }];
  selectedTypeFilterItem = this.typeFilterItems[0];
  maximumNumberOfVisibleLines: Number;
  INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES = INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES;

  log: Log;
  filteredLogLines: LogLine[];

  selectedTypeFilterItemChanged() {
    this.updateFilteredLogLines();
    this.resetMaximumNumberOfVisibleLines();
  }

  ngOnInit() {
const logResponse =
// `09-27 09:04:29.863: I/Remoter(1418): Saved screenshot to '/data/screenshots/__pmv__-0067.jpg'
// 09-27 09:04:30.866: I/Remoter(1418): Saved screenshot to '/data/screenshots/__pmv__-0068.jpg'
// 09-27 09:04:31.870: I/Remoter(1418): Saved screenshot to '/data/screenshots/__pmv__-0069.jpg'
// 09-27 09:04:32.873: I/Remoter(1418): Saved screenshot to '/data/screenshots/__pmv__-0070.jpg'
// 09-27 09:04:33.651: D/AndroidRuntime(4376): >>>>>> START com.android.internal.os.RuntimeInit uid 0 <<<<<<
// 09-27 09:04:33.653: D/AndroidRuntime(4376): CheckJNI is OFF
// 09-27 09:04:33.671: D/ICU(4376): No timezone override file found: /data/misc/zoneinfo/current/icu/icu_tzdata.dat
// 09-27 09:04:33.671: D/ICU(4376): [ 09-27 09:04:33.722  4376: 4376 W/         ]
// 09-27 09:04:33.671: D/ICU(4376): Failed to bind-mount /system/lib/x86/cpuinfo as /proc/cpuinfo: No such file or directory
// 09-27 09:04:33.726: E/memtrack(4376): Couldn't load memtrack module (No such file or directory)
// 09-27 09:04:33.726: E/android.os.Debug(4376): failed to load memtrack module: -2
// 09-27 09:04:33.727: I/Radio-JNI(4376): register_android_hardware_Radio DONE
// 09-27 09:04:33.731: D/AndroidRuntime(4376): Calling main entry com.android.commands.pm.Pm
// 09-27 09:04:33.731: D/AndroidRuntime(4376): [ 09-27 09:04:33.735  1405: 1405 I/         ]
// 09-27 09:04:33.731: D/AndroidRuntime(4376): free_cache(639736) avail 3933024256
// 09-27 09:04:33.829: I/ActivityManager(1679): Start proc 4386:com.android.defcontainer/u0a8 for service com.android.defcontainer/.DefaultContainerService
// 09-27 09:04:33.805: I/main(1401): type=1400 audit(0.0:69): avc: denied { getattr } for path="/sys/kernel/debug/tracing/trace_marker" dev="tracefs" ino=1049 scontext=u:r:zygote:s0 tcontext=u:object_r:debugfs_tracing:s0 tclass=file permissive=1
// 09-27 09:04:33.815: I/main(4386): type=1400 audit(0.0:70): avc: denied { write } for name="trace_marker" dev="tracefs" ino=1049 scontext=u:r:zygote:s0 tcontext=u:object_r:debugfs_tracing:s0 tclass=file permissive=1
// 09-27 09:04:33.866: I/ActivityManager(1679): Start proc 4401:com.android.vending/u0a25 for broadcast com.android.vending/com.google.android.vending.verifier.PackageVerificationReceiver
// 09-27 09:04:33.815: I/main(4386): type=1400 audit(0.0:71): avc: denied { open } for path="/sys/kernel/debug/tracing/trace_marker" dev="tracefs" ino=1049 scontext=u:r:zygote:s0 tcontext=u:object_r:debugfs_tracing:s0 tclass=file permissive=1
// 09-27 09:04:33.889: I/Remoter(1418): Saved screenshot to '/data/screenshots/__pmv__-0071.jpg'
// 09-27 09:04:33.892: W/System(4401): ClassLoader referenced unknown path: /system/priv-app/Phonesky/lib/x86
// 09-27 09:04:33.906: W/Finsky(4401): [1] com.google.android.finsky.FinskyApp.i(1468): No account configured on this device.
// 09-27 09:04:33.908: W/Finsky(4401): [1] com.google.android.finsky.FinskyApp.i(1468): No account configured on this device.
// 09-27 09:04:33.909: W/Finsky(4401): [1] com.google.android.finsky.FinskyApp.i(1468): No account configured on this device.`
`[connected]
Jan  3 06:16:37 iPhone lockdownd[71] <Notice>: handle_get_value: <private>
Jan  3 06:16:37 iPhone lockbot[84] <Notice>: main_block_invoke: <private>
Jan  3 06:16:37 iPhone lockbot[84] <Notice>: main_block_invoke: <private>
Jan  3 06:16:37 iPhone lockbot[84] <Notice>: main_block_invoke: <private>
Jan  3 06:16:37 iPhone lockbot[84] <Notice>: main_block_invoke: <private>
Jan  3 06:16:37 iPhone lockbot[84] <Notice>: main_block_invoke: <private>
Jan  3 06:16:37 iPhone lockbot[84] <Notice>: main_block_invoke: <private>
Jan  3 06:16:37 iPhone trustd[169] <Notice>: cert[0]: AnchorTrusted =(leaf)[force]> 0
Jan  3 06:16:37 iPhone trustd[169] <Notice>: cert[0]: NonEmptySubject =(path)[]> 0
Jan  3 06:16:37 iPhone lockdownd[71] <Notice>: handle_start_service: <private>
Jan  3 06:16:37 iPhone lockdownd[71] <Notice>: spawn_xpc_service: <private>
Jan  3 06:16:37 iPhone lockdownd[71] <Notice>: spawn_xpc_service_block_invoke: <private>
Jan  3 06:16:37 iPhone lockdownd[71] <Notice>: spawn_xpc_service_block_invoke: <private>
Jan  3 06:16:37 iPhone locationd[64] <Notice>: @WifiFlow, scanusage, aps, 1, type, Stage2, lastscan, 1, use, 1, bystander+, 1, spectator+, 1, reqtype, none
Jan  3 06:16:37 iPhone locationd[64] <Notice>: @WifiFlow, scannotify, aps, 1, Stage2, clients, 1, doCalc, 1, ls, 1
Jan  3 06:16:37 iPhone locationd[64] <Notice>: {"msg":"computed wifi position", "numberOfInputAps":0, "validLocationHint":0, "computedValidLocation":0, "numberOfApsActuallyUsed":0}
Jan  3 06:16:37 iPhone locationd[64] <Notice>: @WifiFlow, compute, 0, hacc, -1.0, conf, 63, reason, scan
Jan  3 06:16:37 iPhone locationd[64] <Notice>: {"msg":"CLWifiPositioningSystemLogic::apply", "event":"elapsed", "begin_mach":26480843470908, "end_mach":26480843642844, "elapsed_s":"0.007164000", "event":"Wifi::Scan", "now_s":"568217797.843968987"}
Jan  3 06:16:37 iPhone locationd[64] <Notice>: {"msg":"CLWifiPositioningSystemLogic::apply", "event":"elapsed", "begin_mach":26480843674246, "end_mach":26480843686170, "elapsed_s":"0.000496833", "event":"AlsRequest::NetworkLocationProviderResults", "now_s":"568217797.854918003"}
Jan  3 06:16:37 iPhone locationd[64] <Notice>: @WifiFlow, nexttimer, 15
Jan  3 06:16:37 iPhone locationd[64] <Notice>: @WifiFlow, outcome, nofix
Jan  3 06:16:37 iPhone locationd[64] <Notice>: @ClxWifi, Fix, 0, ll, N/A
Jan  3 06:16:37 iPhone ScreenShotr(FrontBoardServices)[42981] <Notice>: [FBDisplayManager=0x101504360] silently connecting <FBSDisplayConfiguration: 0x10121f840; Main; mode: "375x667@2x 60Hz p3 SDR"> {
    CADisplay.name = LCD;
    CADisplay.deviceName = primary;
    CADisplay.seed = 2;
    tags = 0;
    currentMode = <FBSDisplayMode: 0x101228010; 375x667@2x (750x1334/2) 60Hz p3 SDR>;
    safeOverscanRatio = {0.89999997615814209, 0.89999997615814209};
    nativeCenter = {375, 667};
    pixelSize = {750, 1334};
    bounds = {{0, 0}, {375, 667}};
    CADisplay = <CADisplay:LCD primary>;
Jan  3 06:16:48 iPhone itunescloudd[160] <Notice>: Received distributed notification: com.apple.LaunchServices.applicationRegistered
Jan  3 06:16:48 iPhone accountsd(AccountsDaemon)[97] <Notice>: "<private> (<private>) received"
Jan  3 06:16:48 iPhone itunesstored(CFNetwork)[112] <Notice>: TIC Enabling TLS [341:0x100c77790]
Jan  3 06:16:48 iPhone itunesstored(CFNetwork)[112] <Notice>: TIC TCP Conn Start [341:0x100c77790]
Jan  3 06:16:48 iPhone itunesstored(CFNetwork)[112] <Notice>: Task <B7574E32-4CDF-4FF7-A8FA-B2EEE66B40FE>.<7> setting up Connection 341
Jan  3 06:16:48 iPhone watchlistd(VideoSubscriberAccount)[145] <Notice>: Fetched subscriptions: <private>
Jan  3 06:16:48 iPhone watchlistd(VideoSubscriberAccount)[145] <Notice>: Will call registration center fetch completion handler with subscriptions <private> or error (null).
Jan  3 06:16:48 iPhone watchlistd(VideoSubscriberAccount)[145] <Notice>: Did call registration center fetch completion handler with subscriptions <private> or error (null).
Jan  3 06:16:48 iPhone trustd[169] <Notice>: cert[0]: SubjectCommonName =(leaf)[]> 0
Jan  3 06:16:48 iPhone trustd[169] <Notice>: cert[0]: CheckLeafMarkerOid =(leaf)[]> 0
Jan  3 06:16:48 iPhone trustd[169] <Notice>: cert[0]: IssuerCommonName =(path)[]> 0
Jan  3 06:16:48 iPhone online-auth-agent(Security)[220] <Notice>:  [leaf CheckLeafMarkerOid IssuerCommonName SubjectCommonName]
Jan  3 06:16:48 iPhone itunesstored(CFNetwork)[112] <Notice>: TIC TCP Conn Event [341:0x100c77790]: 3
Jan  3 06:16:48 iPhone itunesstored(CFNetwork)[112] <Error>: TIC TCP Conn Failed [341:0x100c77790]: 12:8 Err(-65554)
Jan  3 06:16:48 iPhone itunesstored(CFNetwork)[112] <Notice>: TIC TCP Conn Cancel [341:0x100c77790]
Jan  3 06:16:48 iPhone itunesstored(CFNetwork)[112] <Error>: Task <B7574E32-4CDF-4FF7-A8FA-B2EEE66B40FE>.<7> HTTP load failed (error code: -1003 [12:8])
Jan  3 06:16:48 iPhone itunesstored(CFNetwork)[112] <Error>: Task <B7574E32-4CDF-4FF7-A8FA-B2EEE66B40FE>.<7> finished with error - code: -1003
Jan  3 06:16:48 iPhone itunesstored(CFNetwork)[112] <Notice>: _CFNetworkIsConnectedToInternet returning 1, flagsValid: 1, flags: 0x2
}`

    this.log = new Log().deserialize(logResponse);

    this.updateFilteredLogLines();
    this.resetMaximumNumberOfVisibleLines();
  }

  updateFilteredLogLines() {
    this.filteredLogLines = this.log.lines.filter((logLine: LogLine) => !this.selectedTypeFilterItem.acceptedTypes || this.selectedTypeFilterItem.acceptedTypes.includes(logLine.type));
  }

  resetMaximumNumberOfVisibleLines() {
    this.maximumNumberOfVisibleLines = INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES;
  }
}
