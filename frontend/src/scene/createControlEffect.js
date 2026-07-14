import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

const BALL_CONTROL_RADIUS = 1.5;

export function createControlEffect(scene, advancedTexture) {
  const aimShotMaterial = new BABYLON.StandardMaterial('aimShotMaterial', scene);
  aimShotMaterial.emissiveColor = new BABYLON.Color3(1, 0.55, 0.12);
  aimShotMaterial.diffuseColor = new BABYLON.Color3(1, 0.45, 0.08);
  aimShotMaterial.alpha = 0.68;
  aimShotMaterial.disableLighting = true;
  aimShotMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;

  const aimPassMaterial = new BABYLON.StandardMaterial('aimPassMaterial', scene);
  aimPassMaterial.emissiveColor = new BABYLON.Color3(0.1, 1, 0.65);
  aimPassMaterial.diffuseColor = new BABYLON.Color3(0.05, 0.85, 0.45);
  aimPassMaterial.alpha = 0.76;
  aimPassMaterial.disableLighting = true;
  aimPassMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;

  const aimShotGlowMaterial = aimShotMaterial.clone('aimShotGlowMaterial');
  aimShotGlowMaterial.alpha = 0.16;
  const aimPassGlowMaterial = aimPassMaterial.clone('aimPassGlowMaterial');
  aimPassGlowMaterial.alpha = 0.2;

  // Flecha larga de doble capa: núcleo translúcido y silueta suave debajo.
  // El chevrón converge en +Z (la punta real de lanzamiento).
  const aimArrowRoot = new BABYLON.TransformNode('aimArrowRoot', scene);
  const aimArrowMeshes = [];
  const aimArrowGlowMeshes = [];
  const arrowShaft = BABYLON.MeshBuilder.CreateBox('aimArrowShaft', {
    width: 0.16,
    height: 0.045,
    depth: 3.35,
  }, scene);
  arrowShaft.position.z = 1.78;
  aimArrowMeshes.push(arrowShaft);

  const arrowHeadLeft = BABYLON.MeshBuilder.CreateBox('aimArrowHeadLeft', {
    width: 0.18,
    height: 0.05,
    depth: 1.08,
  }, scene);
  arrowHeadLeft.position.set(-0.36, 0, 3.72);
  arrowHeadLeft.rotation.y = Math.PI / 4;
  aimArrowMeshes.push(arrowHeadLeft);

  const arrowHeadRight = arrowHeadLeft.clone('aimArrowHeadRight');
  arrowHeadRight.position.x = 0.36;
  arrowHeadRight.rotation.y = -Math.PI / 4;
  aimArrowMeshes.push(arrowHeadRight);

  const glowShaft = BABYLON.MeshBuilder.CreateBox('aimArrowGlowShaft', {
    width: 0.48,
    height: 0.018,
    depth: 3.55,
  }, scene);
  glowShaft.position.set(0, -0.018, 1.78);
  aimArrowGlowMeshes.push(glowShaft);

  const glowHeadLeft = BABYLON.MeshBuilder.CreateBox('aimArrowGlowHeadLeft', {
    width: 0.44,
    height: 0.018,
    depth: 1.22,
  }, scene);
  glowHeadLeft.position.set(-0.38, -0.018, 3.72);
  glowHeadLeft.rotation.y = Math.PI / 4;
  aimArrowGlowMeshes.push(glowHeadLeft);

  const glowHeadRight = glowHeadLeft.clone('aimArrowGlowHeadRight');
  glowHeadRight.position.x = 0.38;
  glowHeadRight.rotation.y = -Math.PI / 4;
  aimArrowGlowMeshes.push(glowHeadRight);

  aimArrowMeshes.forEach((mesh) => {
    mesh.parent = aimArrowRoot;
    mesh.material = aimShotMaterial;
    mesh.isPickable = false;
    mesh.renderingGroupId = 1;
  });
  aimArrowGlowMeshes.forEach((mesh) => {
    mesh.parent = aimArrowRoot;
    mesh.material = aimShotGlowMaterial;
    mesh.isPickable = false;
    mesh.renderingGroupId = 1;
  });
  aimArrowRoot.setEnabled(false);

  const passTargetRing = BABYLON.MeshBuilder.CreateTorus('passTargetRing', {
    diameter: 2.25,
    thickness: 0.11,
    tessellation: 40,
  }, scene);
  passTargetRing.material = aimPassMaterial;
  passTargetRing.isPickable = false;
  passTargetRing.isVisible = false;
  passTargetRing.renderingGroupId = 1;

  const passTargetLabel = new GUI.Rectangle('passTargetLabel');
  passTargetLabel.width = '74px';
  passTargetLabel.height = '26px';
  passTargetLabel.cornerRadius = 13;
  passTargetLabel.thickness = 1;
  passTargetLabel.color = '#6ee7b7';
  passTargetLabel.background = 'rgba(4, 45, 32, 0.88)';
  passTargetLabel.isPointerBlocker = false;
  passTargetLabel.isVisible = false;
  advancedTexture.addControl(passTargetLabel);

  const passTargetText = new GUI.TextBlock('passTargetText');
  passTargetText.text = 'PASS';
  passTargetText.color = '#d1fae5';
  passTargetText.fontSize = 13;
  passTargetText.fontWeight = 'bold';
  passTargetLabel.addControl(passTargetText);

  const setPassAim = (enabled) => {
    const coreMaterial = enabled ? aimPassMaterial : aimShotMaterial;
    const glowMaterial = enabled ? aimPassGlowMaterial : aimShotGlowMaterial;
    aimArrowMeshes.forEach((mesh) => { mesh.material = coreMaterial; });
    aimArrowGlowMeshes.forEach((mesh) => { mesh.material = glowMaterial; });
  };

  const controlRing = BABYLON.MeshBuilder.CreateTorus('controlRing', {
    diameter: BALL_CONTROL_RADIUS * 2,
    thickness: 0.2,
    tessellation: 32,
  }, scene);

  const ringMaterial = new BABYLON.StandardMaterial('ringMaterial', scene);
  ringMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.8, 1);
  ringMaterial.alpha = 0.6;
  controlRing.material = ringMaterial;
  controlRing.isVisible = false;

  const rangeRing = BABYLON.MeshBuilder.CreateTorus('rangeRing', {
    diameter: BALL_CONTROL_RADIUS * 2,
    thickness: 0.06,
    tessellation: 32,
  }, scene);
  const rangeMaterial = new BABYLON.StandardMaterial('rangeMaterial', scene);
  rangeMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.9, 0.4);
  rangeMaterial.alpha = 0.35;
  rangeRing.material = rangeMaterial;
  rangeRing.isVisible = false;

  const particles = [];
  for (let i = 0; i < 20; i++) {
    const particle = BABYLON.MeshBuilder.CreateSphere(`particle${i}`, {
      diameter: 0.1,
      segments: 8,
    }, scene);
    const particleMaterial = new BABYLON.StandardMaterial(`particleMat${i}`, scene);
    particleMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.8, 1);
    particleMaterial.alpha = 0.6;
    particle.material = particleMaterial;
    particle.isVisible = false;
    particle.life = 0;
    particle.maxLife = 0.5 + Math.random() * 0.5;
    particle.velocity = new BABYLON.Vector3(0, 0, 0);
    particles.push(particle);
  }

  const animateParticles = (ballPosition) => {
    particles.forEach((particle) => {
      if (particle.life > 0) {
        particle.position.addInPlace(particle.velocity);
        particle.life -= scene.getEngine().getDeltaTime() / 1000;
        particle.material.alpha = (particle.life / particle.maxLife) * 0.6;
        if (particle.life <= 0) particle.isVisible = false;
      } else if (Math.random() < 0.1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5;
        particle.position = new BABYLON.Vector3(
          ballPosition.x + Math.cos(angle) * radius,
          ballPosition.y,
          ballPosition.z + Math.sin(angle) * radius,
        );
        particle.velocity = new BABYLON.Vector3(
          (Math.random() - 0.5) * 0.1,
          0.05,
          (Math.random() - 0.5) * 0.1,
        );
        particle.life = particle.maxLife;
        particle.isVisible = true;
        particle.material.alpha = 0.6;
      }
    });
  };

  const stopParticles = () => {
    particles.forEach((particle) => {
      particle.isVisible = false;
      particle.life = 0;
    });
  };

  const controlTimeText = new GUI.TextBlock();
  controlTimeText.text = '';
  controlTimeText.color = 'white';
  controlTimeText.fontSize = 14;
  controlTimeText.fontWeight = 'bold';
  controlTimeText.isVisible = false;
  advancedTexture.addControl(controlTimeText);

  const controlPlayerNameText = new GUI.TextBlock();
  controlPlayerNameText.text = '';
  controlPlayerNameText.color = '#a8f0ff';
  controlPlayerNameText.fontSize = 16;
  controlPlayerNameText.fontWeight = 'bold';
  controlPlayerNameText.isVisible = false;
  advancedTexture.addControl(controlPlayerNameText);

  const ballHalo = BABYLON.MeshBuilder.CreateTorus('ballHalo', {
    diameter: 1.2,
    thickness: 0.1,
    tessellation: 32,
  }, scene);
  const haloMaterial = new BABYLON.StandardMaterial('haloMaterial', scene);
  haloMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.8, 1);
  haloMaterial.alpha = 0.4;
  ballHalo.material = haloMaterial;
  ballHalo.isVisible = false;

  return {
    aimArrowRoot,
    aimArrowMeshes,
    aimArrowGlowMeshes,
    passTargetRing,
    passTargetLabel,
    passTargetText,
    setPassAim,
    aimDirection: null,
    passTargetId: null,
    controlRing,
    rangeRing,
    animateParticles,
    stopParticles,
    controlTimeText,
    controlPlayerNameText,
    ballHalo,
    particles,
  };
}

export { BALL_CONTROL_RADIUS };
