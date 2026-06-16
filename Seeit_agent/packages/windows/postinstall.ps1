$programData = [System.Environment]::GetFolderPath("CommonApplicationData")

# Create required directories
$directoriesToCreate = @(
    "$programData\Seeit-agent",
    "$programData\Seeit-agent\config",
    "$programData\Seeit-agent\config\shared",
    "$programData\Seeit-agent\var",
    "$programData\Seeit-agent\run"
)
foreach ($dir in $directoriesToCreate) {
    if (-not (Test-Path $dir)) {
        Write-Host "Creating directory: $dir"
        New-Item -ItemType Directory -Path $dir | Out-Null
    } else {
        Write-Host "Directory already exists: $dir"
    }
}
Write-Host "Directories created successfully."

# Install Seeit agent service
$serviceName = "Seeit-agent"
$agentExe = "$PSScriptRoot\Seeit-agent.exe"

Write-Host "Installing service $serviceName."
if (-not (Get-Service -Name $serviceName -ErrorAction SilentlyContinue)) {
    & $agentExe --install-service
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error installing service $serviceName. Error code: $LASTEXITCODE."
        exit 1
    }
    Write-Host "Service $serviceName installed successfully."
} else {
    Write-Host "Service $serviceName already installed."
}

# Register "Seeit-agent" as an Event Log source if not already present
$logName = "Application"
$sourceName = "Seeit-agent"

$eventLogExists = [System.Diagnostics.EventLog]::SourceExists($sourceName)

if (-not $eventLogExists) {
    try {
        Write-Host "Registering event log source: $sourceName"
        New-EventLog -LogName $logName -Source $sourceName
        Write-Host "Event log source registered successfully."
    } catch {
        Write-Host "Failed to register event log source: $_"
        exit 1
    }
} else {
    Write-Host "Event log source '$sourceName' is already registered."
}

Write-Host "postinstall.ps1 script completed."

# Delete script after execution
$scriptPath = "$PSScriptRoot\postinstall.ps1"
Write-Host "Deleting script: $scriptPath"
Remove-Item -Path $scriptPath -Force
