'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">employee-frontend-starter documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-b067ba99f61b764f20152a7636fa4c63041c784ce5c45f29e3de577d18f1509978826c9ebf119257a3002bf4e773cf04e582b56ded496e63889822baa0abefc8"' : 'data-target="#xs-components-links-module-AppModule-b067ba99f61b764f20152a7636fa4c63041c784ce5c45f29e3de577d18f1509978826c9ebf119257a3002bf4e773cf04e582b56ded496e63889822baa0abefc8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-b067ba99f61b764f20152a7636fa4c63041c784ce5c45f29e3de577d18f1509978826c9ebf119257a3002bf4e773cf04e582b56ded496e63889822baa0abefc8"' :
                                            'id="xs-components-links-module-AppModule-b067ba99f61b764f20152a7636fa4c63041c784ce5c45f29e3de577d18f1509978826c9ebf119257a3002bf4e773cf04e582b56ded496e63889822baa0abefc8"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmableDeleteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmableDeleteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmployeeDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmployeeDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmployeeEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmployeeEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmployeeListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmployeeListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavigationBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavigationBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QualificationDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QualificationDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QualificationEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QualificationEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QualificationListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QualificationListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatusBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatusBarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Employee.html" data-type="entity-link" >Employee</a>
                            </li>
                            <li class="link">
                                <a href="classes/Qualification.html" data-type="entity-link" >Qualification</a>
                            </li>
                            <li class="link">
                                <a href="classes/QualificationEmployee.html" data-type="entity-link" >QualificationEmployee</a>
                            </li>
                            <li class="link">
                                <a href="classes/QualificationEmployees.html" data-type="entity-link" >QualificationEmployees</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationResult.html" data-type="entity-link" >ValidationResult</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmployeeService.html" data-type="entity-link" >EmployeeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HistoryService.html" data-type="entity-link" >HistoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QualificationService.html" data-type="entity-link" >QualificationService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});