/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

import type {
  CommandParamTypeAnnotation,
  CommandTypeAnnotation,
  ComponentShape,
  NamedShape,
  SchemaType,
} from '../../CodegenSchema';

type FilesOutput = Map<string, string>;

function getOrdinalNumber(num: number): string {
  switch (num) {
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
  }

  if (num <= 20) {
    return `${num}th`;
  }

  return 'unknown';
}

const ProtocolTemplate = ({
  componentName,
  methods,
}: {
  componentName: string,
  methods: string,
}) =>
  `
@protocol RCT${componentName}ViewProtocol <NSObject>
${methods}
@end
`.trim();

const CommandHandlerIfCaseConvertArgTemplate = ({
  componentName,
  expectedKind,
  argNumber,
  argNumberString,
  expectedKindString,
  argConversion,
}: {
  componentName: string,
  expectedKind: string,
  argNumber: number,
  argNumberString: string,
  expectedKindString: string,
  argConversion: string,
}) =>
  `
  NSObject *arg${argNumber} = args[${argNumber}];
#if RCT_DEBUG
  if (!RCTValidateTypeOfViewCommandArgument(arg${argNumber}, ${expectedKind}, @"${expectedKindString}", @"${componentName}", commandName, @"${argNumberString}")) {
    return;
  }
#endif
  ${argConversion}
`.trim();

const CommandHandlerIfCaseTemplate = ({
  componentName,
  commandName,
  numArgs,
  convertArgs,
  commandCall,
}: {
  componentName: string,
  commandName: string,
  numArgs: number,
  convertArgs: string,
  commandCall: string,
}) =>
  `
if ([commandName isEqualToString:@"${commandName}"]) {
#if RCT_DEBUG
  if ([args count] != ${numArgs}) {
    RCTLogError(@"%@ command %@ received %d arguments, expected %d.", @"${componentName}", commandName, (int)[args count], ${numArgs});
    return;
  }
#endif

  ${convertArgs}

  ${commandCall}
  return;
}
`.trim();

const CommandHandlerTemplate = ({
  componentName,
  ifCases,
}: {
  componentName: string,
  ifCases: string,
}) =>
  `
RCT_EXTERN inline void RCT${componentName}HandleCommand(
  id<RCT${componentName}ViewProtocol> componentView,
  NSString const *commandName,
  NSArray const *args)
{
  ${ifCases}

#if RCT_DEBUG
  RCTLogError(@"%@ received command %@, which is not a supported command.", @"${componentName}", commandName);
#endif
}
`.trim();

const FileTemplate = ({componentContent}: {componentContent: string}) =>
  `
/**
* This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
*
* Do not edit this file as changes may cause incorrect behavior and will be lost
* once the code is regenerated.
*
* ${'@'}generated by codegen project: GenerateComponentHObjCpp.js
*/

#import <Foundation/Foundation.h>
#import <React/RCTDefines.h>
#import <React/RCTLog.h>

NS_ASSUME_NONNULL_BEGIN

${componentContent}

NS_ASSUME_NONNULL_END
`.trim();

type Param = NamedShape<CommandParamTypeAnnotation>;

function getObjCParamType(param: Param): string {
  const {typeAnnotation} = param;

  switch (typeAnnotation.type) {
    case 'ReservedTypeAnnotation':
      switch (typeAnnotation.name) {
        case 'RootTag':
          return 'double';
        default:
          (typeAnnotation.name: empty);
          throw new Error(`Receieved invalid type: ${typeAnnotation.name}`);
      }
    case 'BooleanTypeAnnotation':
      return 'BOOL';
    case 'DoubleTypeAnnotation':
      return 'double';
    case 'FloatTypeAnnotation':
      return 'float';
    case 'Int32TypeAnnotation':
      return 'NSInteger';
    case 'StringTypeAnnotation':
      return 'NSString *';
    case 'ArrayTypeAnnotation':
      return 'const NSArray *';
    default:
      (typeAnnotation.type: empty);
      throw new Error('Received invalid param type annotation');
  }
}

function getObjCExpectedKindParamType(param: Param): string {
  const {typeAnnotation} = param;

  switch (typeAnnotation.type) {
    case 'ReservedTypeAnnotation':
      switch (typeAnnotation.name) {
        case 'RootTag':
          return '[NSNumber class]';
        default:
          (typeAnnotation.name: empty);
          throw new Error(`Receieved invalid type: ${typeAnnotation.name}`);
      }
    case 'BooleanTypeAnnotation':
      return '[NSNumber class]';
    case 'DoubleTypeAnnotation':
      return '[NSNumber class]';
    case 'FloatTypeAnnotation':
      return '[NSNumber class]';
    case 'Int32TypeAnnotation':
      return '[NSNumber class]';
    case 'StringTypeAnnotation':
      return '[NSString class]';
    case 'ArrayTypeAnnotation':
      return '[NSArray class]';
    default:
      (typeAnnotation.type: empty);
      throw new Error('Received invalid param type annotation');
  }
}

function getReadableExpectedKindParamType(param: Param): string {
  const {typeAnnotation} = param;

  switch (typeAnnotation.type) {
    case 'ReservedTypeAnnotation':
      switch (typeAnnotation.name) {
        case 'RootTag':
          return 'double';
        default:
          (typeAnnotation.name: empty);
          throw new Error(`Receieved invalid type: ${typeAnnotation.name}`);
      }
    case 'BooleanTypeAnnotation':
      return 'boolean';
    case 'DoubleTypeAnnotation':
      return 'double';
    case 'FloatTypeAnnotation':
      return 'float';
    case 'Int32TypeAnnotation':
      return 'number';
    case 'StringTypeAnnotation':
      return 'string';
    case 'ArrayTypeAnnotation':
      return 'array';
    default:
      (typeAnnotation.type: empty);
      throw new Error('Received invalid param type annotation');
  }
}

function getObjCRightHandAssignmentParamType(
  param: Param,
  index: number,
): string {
  const {typeAnnotation} = param;

  switch (typeAnnotation.type) {
    case 'ReservedTypeAnnotation':
      switch (typeAnnotation.name) {
        case 'RootTag':
          return `[(NSNumber *)arg${index} doubleValue]`;
        default:
          (typeAnnotation.name: empty);
          throw new Error(`Receieved invalid type: ${typeAnnotation.name}`);
      }
    case 'BooleanTypeAnnotation':
      return `[(NSNumber *)arg${index} boolValue]`;
    case 'DoubleTypeAnnotation':
      return `[(NSNumber *)arg${index} doubleValue]`;
    case 'FloatTypeAnnotation':
      return `[(NSNumber *)arg${index} floatValue]`;
    case 'Int32TypeAnnotation':
      return `[(NSNumber *)arg${index} intValue]`;
    case 'StringTypeAnnotation':
      return `(NSString *)arg${index}`;
    case 'ArrayTypeAnnotation':
      return `(NSArray *)arg${index}`;
    default:
      (typeAnnotation.type: empty);
      throw new Error('Received invalid param type annotation');
  }
}

function generateProtocol(
  component: ComponentShape,
  componentName: string,
): string {
  const methods = component.commands
    .map(command => {
      const params = command.typeAnnotation.params;
      const paramString =
        params.length === 0
          ? ''
          : params
              .map((param, index) => {
                const objCType = getObjCParamType(param);

                return `${index === 0 ? '' : param.name}:(${objCType})${
                  param.name
                }`;
              })
              .join(' ');
      return `- (void)${command.name}${paramString};`;
    })
    .join('\n')
    .trim();

  return ProtocolTemplate({
    componentName,
    methods,
  });
}

function generateConvertAndValidateParam(
  param: Param,
  index: number,
  componentName: string,
): string {
  const leftSideType = getObjCParamType(param);
  const expectedKind = getObjCExpectedKindParamType(param);
  const expectedKindString = getReadableExpectedKindParamType(param);
  const argConversion = `${leftSideType} ${
    param.name
  } = ${getObjCRightHandAssignmentParamType(param, index)};`;

  return CommandHandlerIfCaseConvertArgTemplate({
    componentName,
    argConversion,
    argNumber: index,
    argNumberString: getOrdinalNumber(index + 1),
    expectedKind,
    expectedKindString,
  });
}

function generateCommandIfCase(
  command: NamedShape<CommandTypeAnnotation>,
  componentName: string,
) {
  const params = command.typeAnnotation.params;

  const convertArgs = params
    .map((param, index) =>
      generateConvertAndValidateParam(param, index, componentName),
    )
    .join('\n\n')
    .trim();

  const commandCallArgs =
    params.length === 0
      ? ''
      : params
          .map((param, index) => {
            return `${index === 0 ? '' : param.name}:${param.name}`;
          })
          .join(' ');
  const commandCall = `[componentView ${command.name}${commandCallArgs}];`;

  return CommandHandlerIfCaseTemplate({
    componentName,
    commandName: command.name,
    numArgs: params.length,
    convertArgs,
    commandCall,
  });
}

function generateCommandHandler(
  component: ComponentShape,
  componentName: string,
): ?string {
  if (component.commands.length === 0) {
    return null;
  }

  const ifCases = component.commands
    .map(command => generateCommandIfCase(command, componentName))
    .join('\n\n');

  return CommandHandlerTemplate({
    componentName,
    ifCases,
  });
}

module.exports = {
  generate(
    libraryName: string,
    schema: SchemaType,
    packageName?: string,
    assumeNonnull: boolean = false,
    headerPrefix?: string,
  ): FilesOutput {
    const fileName = 'RCTComponentViewHelpers.h';

    const componentContent = Object.keys(schema.modules)
      .map(moduleName => {
        const module = schema.modules[moduleName];
        if (module.type !== 'Component') {
          return;
        }

        const {components} = module;
        // No components in this module
        if (components == null) {
          return null;
        }

        return Object.keys(components)
          .filter(componentName => {
            const component = components[componentName];
            return !(
              component.excludedPlatforms &&
              component.excludedPlatforms.includes('iOS')
            );
          })
          .map(componentName => {
            return [
              generateProtocol(components[componentName], componentName),
              generateCommandHandler(components[componentName], componentName),
            ]
              .join('\n\n')
              .trim();
          })
          .join('\n\n');
      })
      .filter(Boolean)
      .join('\n\n');

    const replacedTemplate = FileTemplate({
      componentContent,
    });

    return new Map([[fileName, replacedTemplate]]);
  },
};
