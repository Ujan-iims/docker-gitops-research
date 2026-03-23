package thesis

# Approved base images
approved_images := {"node:18-alpine", "node:20-alpine"}

# P1: Block privileged containers
deny[msg] {
  input.securityContext.privileged == true
  msg := "P1: Privileged containers are not allowed"
}

# P2: Block root user
deny[msg] {
  input.securityContext.runAsUser == 0
  msg := "P2: Running as root (UID 0) is not allowed"
}

deny[msg] {
  not input.securityContext.runAsUser
  msg := "P2: runAsUser must be set to a non-root UID"
}

# P3: Block unapproved base images
deny[msg] {
  not approved_images[input.image]
  msg := sprintf("P3: Image '%v' is not in the approved list", [input.image])
}
