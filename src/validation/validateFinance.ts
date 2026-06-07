import { ProjectDataBundle } from "../domain/types";
import { ValidationIssue } from "./validateRelations";

function nearlyEqual(a: number, b: number, epsilon = 0.01): boolean {
  return Math.abs(a - b) <= epsilon;
}

export function validateFinance(data: ProjectDataBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  data.lots.forEach((item) => {
    const expectedTtc = item.Montant_Marche_HT * (1 + item.TVA);
    if (!nearlyEqual(item.Montant_Marche_TTC, expectedTtc)) {
      issues.push({
        scope: `lots:${item.Lot_ID}`,
        message: `Montant_Marche_TTC incohérent. Attendu ${expectedTtc}, obtenu ${item.Montant_Marche_TTC}`,
        severity: "warning",
      });
    }

    if (item.Avancement_Pourcent < 0 || item.Avancement_Pourcent > 100) {
      issues.push({
        scope: `lots:${item.Lot_ID}`,
        message: `Avancement_Pourcent hors bornes: ${item.Avancement_Pourcent}`,
        severity: "error",
      });
    }
  });

  data.dqe.forEach((item) => {
    const expectedHt = item.Quantite_Prevue * item.PU_HT;
    const expectedTtc = item.Montant_HT * (1 + item.TVA);

    if (!nearlyEqual(item.Montant_HT, expectedHt)) {
      issues.push({
        scope: `dqe:${item.Ligne_DQE_ID}`,
        message: `Montant_HT incohérent. Attendu ${expectedHt}, obtenu ${item.Montant_HT}`,
        severity: "warning",
      });
    }

    if (!nearlyEqual(item.Montant_TTC, expectedTtc)) {
      issues.push({
        scope: `dqe:${item.Ligne_DQE_ID}`,
        message: `Montant_TTC incohérent. Attendu ${expectedTtc}, obtenu ${item.Montant_TTC}`,
        severity: "warning",
      });
    }
  });

  data.situations.forEach((item) => {
    if (item.Quantite_Periode < 0) {
      issues.push({
        scope: `situations:${item.Situation_ID}`,
        message: `Quantite_Periode négative: ${item.Quantite_Periode}`,
        severity: "error",
      });
    }

    if (item.Quantite_Cumulee < item.Quantite_Periode) {
      issues.push({
        scope: `situations:${item.Situation_ID}`,
        message: `Quantite_Cumulee inférieure à Quantite_Periode`,
        severity: "error",
      });
    }

    if (item.Avancement_Pourcent < 0 || item.Avancement_Pourcent > 100) {
      issues.push({
        scope: `situations:${item.Situation_ID}`,
        message: `Avancement_Pourcent hors bornes: ${item.Avancement_Pourcent}`,
        severity: "error",
      });
    }

    if (item.Montant_Periode_HT < 0 || item.Montant_Cumule_HT < 0 || item.Reste_A_Facturer_HT < 0) {
      issues.push({
        scope: `situations:${item.Situation_ID}`,
        message: `Montants négatifs détectés`,
        severity: "error",
      });
    }

    if (item.Montant_Cumule_HT < item.Montant_Periode_HT) {
      issues.push({
        scope: `situations:${item.Situation_ID}`,
        message: `Montant_Cumule_HT inférieur à Montant_Periode_HT`,
        severity: "error",
      });
    }
  });

  data.facturation_client.forEach((item) => {
    const expectedTtc = item.Montant_HT * (1 + item.TVA);
    const expectedResteDu = item.Montant_TTC - item.Montant_Regle;

    if (!nearlyEqual(item.Montant_TTC, expectedTtc)) {
      issues.push({
        scope: `facturation_client:${item.Facture_ID}`,
        message: `Montant_TTC incohérent. Attendu ${expectedTtc}, obtenu ${item.Montant_TTC}`,
        severity: "warning",
      });
    }

    if (!nearlyEqual(item.Reste_Du, expectedResteDu)) {
      issues.push({
        scope: `facturation_client:${item.Facture_ID}`,
        message: `Reste_Du incohérent. Attendu ${expectedResteDu}, obtenu ${item.Reste_Du}`,
        severity: "warning",
      });
    }

    if (item.Montant_Regle < 0 || item.Reste_Du < 0) {
      issues.push({
        scope: `facturation_client:${item.Facture_ID}`,
        message: `Montant_Regle ou Reste_Du négatif`,
        severity: "error",
      });
    }
  });

  data.suivi_financier.forEach((item) => {
    const expectedBudgetEcart = item.Budget_Initial_HT - item.Montant_Marche_HT;
    const expectedRealiseEcart = item.Montant_Marche_HT - item.Montant_Situations_Validees_HT;

    if (!nearlyEqual(item.Ecart_Budget_Marche_HT, expectedBudgetEcart)) {
      issues.push({
        scope: `suivi_financier:${item.Suivi_ID}`,
        message: `Ecart_Budget_Marche_HT incohérent. Attendu ${expectedBudgetEcart}, obtenu ${item.Ecart_Budget_Marche_HT}`,
        severity: "warning",
      });
    }

    if (!nearlyEqual(item.Ecart_Marche_Realise_HT, expectedRealiseEcart)) {
      issues.push({
        scope: `suivi_financier:${item.Suivi_ID}`,
        message: `Ecart_Marche_Realise_HT incohérent. Attendu ${expectedRealiseEcart}, obtenu ${item.Ecart_Marche_Realise_HT}`,
        severity: "warning",
      });
    }
  });

  return issues;
}
