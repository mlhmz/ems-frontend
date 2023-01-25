import { KeycloakService } from 'keycloak-angular';
/**
 * Function to initialize keycloak and to insert its config
 *
 * @param keycloak - keycloak service from app component
 */
export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://keycloak.szut.dev/auth',
        realm: 'szut',
        clientId: 'employee-management-service-frontend',
      },
      initOptions: {
        checkLoginIframe: true,
        checkLoginIframeInterval: 25,
      },
    });
}
