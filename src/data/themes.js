export const THEMES = {
  embedded: {
    id: 'embedded',
    name: 'Embedded Software & Firmware',
    description: 'For the brave souls dealing with registers, oscillators, and smoking boards.',
    categories: {
      systemc: {
        name: 'SystemC Development',
        phrases: [
          'TLM 2.0 is a lifesaver',
          'Wait, is this cycle-accurate?',
          'The simulation is hanging again',
          'Need to refine the SystemC model',
          'Sizing the buffers for the TLM',
          'Wait, the clock is drifting',
          'Who changed the SystemC parameters?',
          'Simulation takes 4 hours',
          'Is the SC_METHOD triggering?',
          'The wrapper is broken',
          'Need a better SystemC abstraction',
          'The delta cycle is infinite',
          'Is the simulation time advancing?',
          'Need to fix the port binding',
          'The model is too slow for the test'
        ]
      },
      rtl: {
        name: 'RTL Design & Verification',
        phrases: [
          'Race condition in the state machine',
          'Timing violation on the critical path',
          'The FPGA is too small',
          'Need to fix the reset logic',
          'Synthesis failed again',
          'Wait, why is this signal floating?',
          'CDC issues in the clock domain',
          'The waveform looks weird',
          'Is the RTL frozen?',
          'Need to optimize the LUT usage',
          'The testbench is lying to me',
          'Metastability is ruining my day',
          'The timing closure is a nightmare',
          'Need to add more pipeline stages',
          'The simulation doesn\'t match the hardware'
        ]
      },
      mems: {
        name: 'MEMS Sensor Integration',
        phrases: [
          'The sensor is drifting',
          'Calibration is taking forever',
          'I2C address conflict',
          'Noise floor is too high',
          'Is the MEMS chip soldered correctly?',
          'The accelerometer is skewed',
          'Wait, the gyro is saturating',
          'Need to filter the raw data',
          'The datasheet is confusing',
          'Sampling rate is too low',
          'Is the interrupt pin firing?',
          'The sensitivity is off by a factor of 10',
          'Need a better low-pass filter',
          'The sensor is too sensitive to vibration',
          'Is the reference voltage stable?'
        ]
      },
      bringup: {
        name: 'Application Board Bring-up',
        phrases: [
          'The board is smoking',
          'Wait, why is the 3.3V rail at 5V?',
          'The JTAG isn\'t connecting',
          'I can\'t find the UART output',
          'Who swapped the TX/RX pins?',
          'The power LED is blinking',
          'Bootloader is stuck in a loop',
          'Is the crystal oscillating?',
          'Need to check the solder bridges',
          'The board is overheating',
          'First boot successful!',
          'The voltage regulator is screaming',
          'I think I shorted the ground plane',
          'Is the pull-up resistor too strong?',
          'The board is behaving like a brick'
        ]
      },
      agile: {
        name: 'Agile/V-model Workflows',
        phrases: [
          'We\'re in the verification phase',
          'The V-model is too rigid',
          'Wait, the requirements changed',
          'Sprint planning for hardware is hard',
          'Is this a blocker for the tape-out?',
          'The traceability matrix is a mess',
          'Need to update the SRS',
          'We\'re doing a "mini-waterfall"',
          'The sprint is over-committed',
          'Is the user story clear?',
          'V-model verification is failing',
          'Who signed off on these requirements?',
          'The design review took 6 hours',
          'We need a change request for this',
          'Is this within the scope of the V-model?'
        ]
      },
      hil: {
        name: 'Hardware-in-Loop Testing',
        phrases: [
          'The HIL rig is down',
          'The real-time simulation is lagging',
          'Need to simulate the CAN bus',
          'The load board is faulty',
          'Is the HIL test case passing?',
          'The signal generator is out of sync',
          'Need to map the I/O pins',
          'HIL testing is taking too long',
          'The harness is a cable mess',
          'Is the emulator responding?',
          'HIL vs. SIL discrepancy',
          'The real-time kernel is crashing',
          'Need to calibrate the HIL inputs',
          'The test rig is making a weird noise',
          'Is the loopback working?'
        ]
      },
      cicd: {
        name: 'CI/CD for Embedded',
        phrases: [
          'The Jenkins pipeline is red',
          'Embedded CI is so slow',
          'Need to automate the flash process',
          'The runner is out of disk space',
          'Is the artifact uploaded?',
          'The static analysis is complaining',
          'Need to fix the YAML config',
          'CI failed on a flaky test',
          'The build took 20 minutes',
          'Who broke the master branch?',
          'Automated flashing failed',
          'Need a faster compiler for the CI',
          'The container doesn\'t have the toolchain',
          'Is the nightly build finished?',
          'The CI is failing on a hardware timeout'
        ]
      },
      debugging: {
        name: 'Debugging Embedded Systems',
        phrases: [
          'GDB is not attaching',
          'The stack overflowed',
          'Wait, where is the pointer pointing?',
          'The watchdog timer reset the board',
          'Need to check the memory map',
          'Is the breakpoint hitting?',
          'The logic analyzer is showing noise',
          'HardFault handler triggered',
          'The register is not updating',
          'I\'m stepping through the ISR',
          'The bug only happens on hardware',
          'Is it a Heisenbug?',
          'The memory is corrupted',
          'Need to dump the core',
          'The debugger is lying to me'
        ]
      },
      codereview: {
        name: 'Code Review in Embedded',
        phrases: [
          'Too many magic numbers',
          'Need to use volatile here',
          'The interrupt priority is wrong',
          'Is this thread-safe?',
          'Avoid using malloc in the ISR',
          'The naming convention is inconsistent',
          'Need to document the register offsets',
          'Why is this loop infinite?',
          'The logic is too complex',
          'Can we optimize this for size?',
          'LGTM, but check the timing',
          'This will cause a race condition',
          'Need to use a mutex here',
          'The bitmask is incorrect',
          'Is this optimized for the ARM core?'
        ]
      },
      compliance: {
        name: 'Documentation & Compliance',
        phrases: [
          'The datasheet is 500 pages long',
          'Need to update the API doc',
          'The register map is outdated',
          'Who wrote this comment?',
          'The compliance report is due',
          'Is the versioning correct?',
          'The user manual is missing a step',
          'Need to document the errata',
          'The schematic is not updated',
          'Compliance check failed',
          'Documentation is the hardest part',
          'Need to align with the ISO standard',
          'The traceability is missing a link',
          'Who approved this documentation?',
          'The PDF is too large to email'
        ]
      }
    }
  },
  general: {
    id: 'general',
    name: 'General Development',
    description: 'For the web, cloud, and API wizards.',
    categories: {
      web: {
        name: 'Web Dev Classics',
        phrases: [
          'The CSS is breaking on Safari',
          'Need to update the React version',
          'The API is returning 404',
          'Is the cache cleared?',
          'The bundle size is too large',
          'Need to fix the z-index',
          'The responsive design is broken',
          'Wait, is this a browser bug?',
          'The JS bundle is too big',
          'Need to implement lazy loading',
          'The state management is a mess',
          'Is the CDN propagating?',
          'The accessibility audit failed',
          'Need to fix the hydration error',
          'The CSS grid is acting up',
          'Is the API key expired?',
          'The frontend is lagging',
          'Need to optimize the images'
        ]
      },
      backend: {
        name: 'Backend & API',
        phrases: [
          'The database query is slow',
          'Need to optimize the index',
          'The API is lagging',
          'Is the Redis cache hit?',
          'The microservice is down',
          'Need to handle the timeout',
          'The JSON is malformed',
          'The load balancer is failing',
          'Need to implement pagination',
          'The API contract changed',
          'The server is OOMing',
          'Is the database locked?',
          'Need to fix the race condition',
          'The middleware is blocking',
          'Is the token expired?',
          'The API response is too large',
          'Need to implement rate limiting',
          'The logs are missing'
        ]
      },
      devops: {
        name: 'DevOps & Deployment',
        phrases: [
          'The Docker image is too big',
          'K8s is killing the pod',
          'The pipeline is stuck',
          'Need to update the secrets',
          'The environment is inconsistent',
          'Is the Terraform plan correct?',
          'The deployment failed',
          'Need to scale the replicas',
          'The logs are too noisy',
          'Who changed the config?',
          'The cloud bill is too high',
          'The ingress is not working',
          'Need to rotate the certificates',
          'Is the health check passing?',
          'The staging env is broken',
          'Need to update the helm chart',
          'The backup failed',
          'Is the VPC peered?'
        ]
      },
      codereview: {
        name: 'Code Review & PRs',
        phrases: [
          'Nit: use a map here',
          'This needs a unit test',
          'The PR is too large',
          'Can we refactor this?',
          'The logic is slightly off',
          'Need to handle the edge case',
          'This is a duplicate of issue X',
          'The commit message is vague',
          'LGTM, merge it',
          'Wait, this breaks the build',
          'Need a better variable name',
          'Is this a breaking change?',
          'Can we simplify this loop?',
          'The complexity is too high',
          'Need to add a JSDoc',
          'This is a temporary fix',
          'The PR is missing a description',
          'Wait, who approved this?'
        ]
      },
      sprint: {
        name: 'Sprint Planning Rituals',
        phrases: [
          'The story points are too high',
          'Is this a P0 or P1?',
          'The scope is creeping',
          'We\'re over-capacity',
          'The definition of done is vague',
          'Need to break this into smaller tasks',
          'Is this a dependency?',
          'The sprint goal is unclear',
          'We\'re carrying over 5 tickets',
          'The velocity is dropping',
          'Let\'s move this to the backlog',
          'Is this a technical debt?',
          'The ticket is missing a label',
          'We need a grooming session',
          'The estimate was wrong',
          'Is this a blocker?',
          'The sprint is too short',
          'Who owns this ticket?'
        ]
      }
    }
  },
  qa: {
    id: 'qa',
    name: 'QA & Test Engineering',
    description: 'For those who break things so others can fix them.',
    categories: {
      automation: {
        name: 'Test Automation',
        phrases: [
          'The selector changed',
          'The test is flaky',
          'Need to update the Page Object',
          'The automation is too slow',
          'Is the headless browser working?',
          'The test data is stale',
          'Need to implement a wait',
          'The framework is outdated',
          'The test failed on CI',
          'Need to parallelize the tests',
          'The screenshot is empty',
          'The test is timing out',
          'Need to mock the API',
          'The automation is too brittle',
          'Is the driver updated?',
          'The test is skipping',
          'Need to fix the assertions',
          'The test environment is unstable'
        ]
      },
      triage: {
        name: 'Bug Triage',
        phrases: [
          'Cannot reproduce this bug',
          'Is this a feature or a bug?',
          'The severity is too high',
          'Need more logs for this',
          'The bug is intermittent',
          'Is this a regression?',
          'The ticket is missing steps',
          'Who is the owner of this bug?',
          'The bug is closed as "won\'t fix"',
          'Need to prioritize this',
          'The bug is actually a typo',
          'Is this a known issue?',
          'The bug is only on one browser',
          'Need a recording of the bug',
          'The bug is too obscure to fix',
          'Is this a blocker for release?',
          'The bug report is vague',
          'The fix broke another bug'
        ]
      },
      coverage: {
        name: 'Test Coverage Debates',
        phrases: [
          'The coverage is only 40%',
          'Need to write more edge case tests',
          'The coverage report is lying',
          'Is this line actually covered?',
          'The mutation test failed',
          'Need to increase the threshold',
          'The test is passing but coverage is 0',
          'Which module is missing tests?',
          'The coverage is artificially high',
          'Need to mock the external API',
          'Coverage is a vanity metric',
          'Is this path reachable?',
          'The coverage is dropping',
          'Need to add integration tests',
          'The coverage tool is slow',
          'Is the branch coverage correct?',
          'We need more unit tests',
          'The coverage is 100% but it\'s broken'
        ]
      },
      pipeline: {
        name: 'CI Pipeline Failures',
        phrases: [
          'The pipeline is failing',
          'The test environment is down',
          'Need to fix the runner',
          'The artifacts are missing',
          'The pipeline is taking an hour',
          'Is the trigger working?',
          'The build failed on the first step',
          'Need to optimize the pipeline',
          'The logs are truncated',
          'Who broke the CI?',
          'The pipeline is flaky',
          'The runner is out of memory',
          'Need to update the pipeline YAML',
          'The test suite is too large',
          'Is the pipeline cached?',
          'The deployment step failed',
          'The pipeline is stuck in a loop',
          'Need to restart the runner'
        ]
      },
      regression: {
        name: 'Regression Testing',
        phrases: [
          'This worked in the last build',
          'The regression is critical',
          'Need to find the breaking commit',
          'The regression suite is failing',
          'Is this a known issue?',
          'The fix broke something else',
          'Need to run the full suite',
          'The regression is only on mobile',
          'Who merged this without testing?',
          'The regression is subtle',
          'Fixed the regression!',
          'Is this a regression or a new bug?',
          'The regression is intermittent',
          'Need to add a regression test',
          'The regression is in the core',
          'Is the regression reproducible?',
          'The regression is a performance hit',
          'We need a hotfix for this regression'
        ]
      }
    }
  }
};
