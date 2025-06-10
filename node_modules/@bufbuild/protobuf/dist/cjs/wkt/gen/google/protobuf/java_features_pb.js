"use strict";
// Copyright 2021-2025 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.java = exports.JavaFeatures_Utf8ValidationSchema = exports.JavaFeatures_Utf8Validation = exports.JavaFeaturesSchema = exports.file_google_protobuf_java_features = void 0;
const file_js_1 = require("../../../../codegenv2/file.js");
const descriptor_pb_js_1 = require("./descriptor_pb.js");
const message_js_1 = require("../../../../codegenv2/message.js");
const enum_js_1 = require("../../../../codegenv2/enum.js");
const extension_js_1 = require("../../../../codegenv2/extension.js");
/**
 * Describes the file google/protobuf/java_features.proto.
 */
exports.file_google_protobuf_java_features = (0, file_js_1.fileDesc)("CiNnb29nbGUvcHJvdG9idWYvamF2YV9mZWF0dXJlcy5wcm90bxICcGIizAUKDEphdmFGZWF0dXJlcxL+AQoSbGVnYWN5X2Nsb3NlZF9lbnVtGAEgASgIQuEBiAEBmAEEmAEBogEJEgR0cnVlGIQHogEKEgVmYWxzZRjnB7IBuwEI6AcQ6AcasgFUaGUgbGVnYWN5IGNsb3NlZCBlbnVtIGJlaGF2aW9yIGluIEphdmEgaXMgZGVwcmVjYXRlZCBhbmQgaXMgc2NoZWR1bGVkIHRvIGJlIHJlbW92ZWQgaW4gZWRpdGlvbiAyMDI1LiAgU2VlIGh0dHA6Ly9wcm90b2J1Zi5kZXYvcHJvZ3JhbW1pbmctZ3VpZGVzL2VudW0vI2phdmEgZm9yIG1vcmUgaW5mb3JtYXRpb24uEp8CCg91dGY4X3ZhbGlkYXRpb24YAiABKA4yHy5wYi5KYXZhRmVhdHVyZXMuVXRmOFZhbGlkYXRpb25C5AGIAQGYAQSYAQGiAQwSB0RFRkFVTFQYhAeyAcgBCOgHEOkHGr8BVGhlIEphdmEtc3BlY2lmaWMgdXRmOCB2YWxpZGF0aW9uIGZlYXR1cmUgaXMgZGVwcmVjYXRlZCBhbmQgaXMgc2NoZWR1bGVkIHRvIGJlIHJlbW92ZWQgaW4gZWRpdGlvbiAyMDI1LiAgVXRmOCB2YWxpZGF0aW9uIGJlaGF2aW9yIHNob3VsZCB1c2UgdGhlIGdsb2JhbCBjcm9zcy1sYW5ndWFnZSB1dGY4X3ZhbGlkYXRpb24gZmVhdHVyZS4SUQofdXNlX29sZF9vdXRlcl9jbGFzc25hbWVfZGVmYXVsdBgEIAEoCEIoiAEBmAEBogEJEgR0cnVlGIQHogEKEgVmYWxzZRjpB7IBBgjpByDpByJGCg5VdGY4VmFsaWRhdGlvbhIbChdVVEY4X1ZBTElEQVRJT05fVU5LTk9XThAAEgsKB0RFRkFVTFQQARIKCgZWRVJJRlkQAjpCCgRqYXZhEhsuZ29vZ2xlLnByb3RvYnVmLkZlYXR1cmVTZXQY6QcgASgLMhAucGIuSmF2YUZlYXR1cmVzUgRqYXZhQigKE2NvbS5nb29nbGUucHJvdG9idWZCEUphdmFGZWF0dXJlc1Byb3Rv", [descriptor_pb_js_1.file_google_protobuf_descriptor]);
/**
 * Describes the message pb.JavaFeatures.
 * Use `create(JavaFeaturesSchema)` to create a new message.
 */
exports.JavaFeaturesSchema = (0, message_js_1.messageDesc)(exports.file_google_protobuf_java_features, 0);
/**
 * The UTF8 validation strategy to use.  See go/editions-utf8-validation for
 * more information on this feature.
 *
 * @generated from enum pb.JavaFeatures.Utf8Validation
 */
var JavaFeatures_Utf8Validation;
(function (JavaFeatures_Utf8Validation) {
    /**
     * Invalid default, which should never be used.
     *
     * @generated from enum value: UTF8_VALIDATION_UNKNOWN = 0;
     */
    JavaFeatures_Utf8Validation[JavaFeatures_Utf8Validation["UTF8_VALIDATION_UNKNOWN"] = 0] = "UTF8_VALIDATION_UNKNOWN";
    /**
     * Respect the UTF8 validation behavior specified by the global
     * utf8_validation feature.
     *
     * @generated from enum value: DEFAULT = 1;
     */
    JavaFeatures_Utf8Validation[JavaFeatures_Utf8Validation["DEFAULT"] = 1] = "DEFAULT";
    /**
     * Verifies UTF8 validity overriding the global utf8_validation
     * feature. This represents the legacy java_string_check_utf8 option.
     *
     * @generated from enum value: VERIFY = 2;
     */
    JavaFeatures_Utf8Validation[JavaFeatures_Utf8Validation["VERIFY"] = 2] = "VERIFY";
})(JavaFeatures_Utf8Validation || (exports.JavaFeatures_Utf8Validation = JavaFeatures_Utf8Validation = {}));
/**
 * Describes the enum pb.JavaFeatures.Utf8Validation.
 */
exports.JavaFeatures_Utf8ValidationSchema = (0, enum_js_1.enumDesc)(exports.file_google_protobuf_java_features, 0, 0);
/**
 * @generated from extension: optional pb.JavaFeatures java = 1001;
 */
exports.java = (0, extension_js_1.extDesc)(exports.file_google_protobuf_java_features, 0);
